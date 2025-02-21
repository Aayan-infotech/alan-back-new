pipeline {
    agent any

    parameters {
        string(name: 'PROJECT_NAME', defaultValue: 'project1', description: 'Select the project name')
    }

    environment {
        IMAGE_NAME = "docker.io/aayanindia/trade-hunter-backend"
        CONTAINER_PORT = "7878"
        HOST_PORT = "7878"
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
        EMAIL_RECIPIENTS = "rishabh.sharma@aayaninfotech.com"
        SONARTOKEN = credentials('sonartoken')
        AWS_CREDENTIALS_ID = 'aws-credentials'
    }

    stages {
        stage('AWS Credentials Injection') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${AWS_CREDENTIALS_ID}", usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh '''
                        echo "Using AWS Credentials for Project: ${PROJECT_NAME}"
                        export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                        '''
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Run ESLint') {
            steps {
                script {
                    sh '''
                    echo "Running ESLint..."
                    npm run lint || echo "⚠️ ESLint completed with errors, but continuing pipeline..."
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    sh '''
                    echo "Running SonarQube analysis using Docker..."
                    docker run --rm \
                        -v $(pwd):/usr/src \
                        --network host \
                        sonarsource/sonar-scanner-cli:latest \
                        -Dsonar.projectKey=trade-hunter-backend \
                        -Dsonar.sources=/usr/src \
                        -Dsonar.host.url=http://54.236.98.193:9000 \
                        -Dsonar.login=${SONARTOKEN}
                    '''
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh '''
                    echo "Logging in to Docker Hub..."
                    if echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin; then
                        echo "✅ Docker Hub login successful!"
                    else
                        echo "❌ ERROR: Docker Hub login failed! Check credentials in Jenkins."
                        exit 1
                    fi
                    '''
                }
            }
        }

        stage('Generate Next Image Tag') {
            steps {
                script {
                    def latestTag = sh(
                        script: '''
                        curl -s https://hub.docker.com/v2/repositories/aayanindia/trade-hunter-backend/tags/ | \
                        jq -r '.results[].name' | grep -E '^stage-v[0-9]+$' | sort -V | tail -n1 | awk -F'v' '{print $2}'
                        ''' ,
                        returnStdout: true
                    ).trim()

                    def newTag = latestTag ? "stage-v${latestTag.toInteger() + 1}" : "stage-v1"
                    env.NEW_STAGE_TAG = newTag
                    echo "🆕 New Docker Image Tag: ${newTag}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def buildResult = sh(
                        script: '''#!/bin/bash
                        set -eo pipefail
                        echo "Building Docker image..."
                        docker build -t ${IMAGE_NAME}:latest . 2>&1 | tee failure.log
                        ''' ,
                        returnStatus: true
                    )
                    if (buildResult != 0) {
                        error "❌ Docker build failed! Check failure.log"
                    }
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    sh '''
                    echo "Tagging Docker image..."
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${NEW_STAGE_TAG}
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:prodv1
                    '''
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    sh '''
                    echo "Running Trivy security scan..."
                    if docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image \
                        --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME}:${NEW_STAGE_TAG}; then
                        echo "✅ Trivy scan completed!"
                    else
                        echo "⚠️ Trivy scan found vulnerabilities, but continuing pipeline..."
                    fi
                    '''
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    sh '''
                    echo "Pushing Docker images to Docker Hub..."
                    docker push ${IMAGE_NAME}:${NEW_STAGE_TAG}
                    docker push ${IMAGE_NAME}:prodv1
                    '''
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    sh '''
                    echo "Stopping existing container..."
                    CONTAINER_ID=$(docker ps -q --filter "publish=${HOST_PORT}")
                    if [ -n "$CONTAINER_ID" ]; then
                        docker stop "$CONTAINER_ID" || true
                        docker rm "$CONTAINER_ID" || true
                    else
                        echo "No container running on port ${HOST_PORT}"
                    fi
                    '''
                }
            }
        }

        stage('Run New Docker Container') {
            steps {
                script {
                    sh '''
                    echo "Starting new container with latest image..."
                    docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME}:prodv1
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "📩 Sending deployment email..."
                emailext (
                    subject: "🚀 Pipeline Status: ${currentBuild.currentResult} (Build #${BUILD_NUMBER})",
                    body: """
                    <html>
                    <body>
                    <p><strong>Pipeline Status:</strong> ${currentBuild.currentResult}</p>
                    <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                    <p><strong>Check the <a href="${BUILD_URL}">console output</a>.</strong></p>
                    </body>
                    </html>
                    """,
                    to: "${EMAIL_RECIPIENTS}",
                    from: "development.aayanindia@gmail.com",
                    replyTo: "atulrajput.work@gmail.com",
                    mimeType: 'text/html'
                )
            }
        }
    }
}
