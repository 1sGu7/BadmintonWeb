pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_ATLAS_URI')
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                // Sử dụng cleanWorkspace trước khi checkout
                cleanWs()
                git branch: 'main', 
                url: 'https://github.com/1sGu7/BadmintonWeb.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build --no-cache'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                # Dừng container cũ và triển khai mới
                docker-compose down || true
                docker-compose up -d
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                retry(5) {
                    sh '''
                    echo "Checking application health..."
                    curl -Ifs http://localhost:${APP_PORT}/products
                    '''
                    sleep 10
                }
            }
        }
    }
    
    post {
        always {
            // Ghi log để debug nếu cần
            sh 'docker-compose logs --tail 100 web || true'
            sh 'docker-compose logs --tail 100 mongo || true'
            
            // Sử dụng deleteDir thay vì cleanWs
            deleteDir()
        }
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed!'
            sh 'docker-compose down || true'
        }
    }
}
