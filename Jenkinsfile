pipeline {
    agent any

    parameters {
        string(name: 'PROJECT_NAME', defaultValue: 'project1', description: 'Select the project name')
    }

    environment {
        IMAGE_NAME = "docker.io/aayanindia/alan-backend"
        CONTAINER_PORT = "7878"
        HOST_PORT = "7878"
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
        EMAIL_RECIPIENTS = "atul.rajput@aayaninfotech.com"
        SONARTOKEN = credentials('sonartoken')
        AWS_CREDENTIALS_ID = "aws-cred-${params.PROJECT_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

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
                    echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin
                    '''
                }
            }
        }

        stage('Generate Next Image Tag') {
            steps {
                script {
                    sh '''
                    NEXT_TAG=$(curl -s "https://hub.docker.com/v2/repositories/aayanindia/alan-backend/tags" | jq -r '.['"results"'] | sort_by(.name) | last | .name + 1')
                    echo "Next image tag: ${NEXT_TAG}"
                    '''
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    sh '''
                    docker build -t ${IMAGE_NAME}:latest .
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${NEXT_TAG}
                    docker push ${IMAGE_NAME}:${NEXT_TAG}
                    '''
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    sh '''
                    trivy image ${IMAGE_NAME}:${NEXT_TAG}
                    '''
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    sh '''
                    CONTAINER_ID=$(docker ps -q --filter "publish=${HOST_PORT}")
                    if [ -n "$CONTAINER_ID" ]; then
                        docker stop "$CONTAINER_ID" && docker rm "$CONTAINER_ID"
                    fi
                    '''
                }
            }
        }

        stage('Run New Docker Container') {
            steps {
                script {
                    sh '''
                    docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME}:${NEXT_TAG}
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
                    <p><strong>Check the <a href=\"${BUILD_URL}\">console output</a>.</strong></p>
                    </body>
                    </html>
                    """,
                    to: "${EMAIL_RECIPIENTS}",
                    from: "development.aayanindia@gmail.com",
                    replyTo: "atul.rajput@aayaninfotech.com",
                    mimeType: 'text/html'
                )
            }
        }
    }
}
