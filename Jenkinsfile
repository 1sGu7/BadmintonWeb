pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb-atlas-uri')
    }

    stages {
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af'  // Dọn dẹp để tiết kiệm dung lượng
        }
    }
}
