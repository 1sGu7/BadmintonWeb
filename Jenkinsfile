pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb-atlas-uri')
    }

    stages {
        stage('Check Structure') {
            steps {
                sh '''
                    echo "Cấu trúc thư mục:"
                    ls -la
                    echo "Nội dung thư mục app:"
                    ls -la app/
                '''
            }
        }
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Build riêng service web để xem lỗi
                    sh 'docker-compose build web'
                    
                    // Khởi động service web trước
                    sh 'docker-compose up -d web'
                    
                    // Chờ và xem log web
                    sh 'sleep 20'
                    sh 'docker logs web'
                    
                    // Kiểm tra health status
                    sh 'docker inspect --format="{{.State.Health.Status}}" web'
                    
                    // Nếu web healthy thì khởi động nginx
                    sh 'docker-compose up -d nginx'
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af'
        }
    }
}
