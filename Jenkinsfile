pipeline {
    agent any

    environment {
        IMAGE_NAME = 'event-app'
        IMAGE_TAG = 'latest'
        PORT = '4242'
        // host.docker.internal resolves to the host's loopback interface from inside a container
        MONGO_URI = 'mongodb+srv://kazeno1stigma_db_user:MtCXM0atFNbgWjIx@cluster0.sgggplk.mongodb.net/event?retryWrites=true&w=majority'
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
                // Stop and remove existing container if running
                sh 'docker rm -f event-container || true'
                // Run the new container mapping port 4242 and setting the DB URI
                sh "docker run -d -p ${PORT}:${PORT} --name event-container -e MONGO_URI='${MONGO_URI}' ${IMAGE_NAME}:${IMAGE_TAG}"
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
