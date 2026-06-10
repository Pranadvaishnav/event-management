pipeline {
    agent any

    environment {
        IMAGE_NAME = 'event-app'
        IMAGE_TAG = 'latest'
        PORT = '4242'
        // host.docker.internal resolves to the host's loopback interface from inside a container
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

      stage('Deploy Docker Container') {
    steps {
        withCredentials([string(credentialsId: 'mongo-url', variable: 'MONGO_URI')]) {
            sh 'docker rm -f event-container || true'

            sh """
                docker run -d \
                -p ${PORT}:${PORT} \
                --name event-container \
                -e MONGO_URI="$MONGO_URI" \
                ${IMAGE_NAME}:${IMAGE_TAG}
            """
        }
    }
}
}
    post {
        success {
            echo "CI/CD Pipeline succeeded. Application is running on port ${PORT}!"
        }
        failure {
            echo "CI/CD Pipeline failed. Please check build logs."
        }
    }
}
