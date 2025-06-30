pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb+srv://shop_user:shop_password@badminton-shop-cluster.wcjjhqv.mongodb.net/?retryWrites=true&w=majority&appName=badminton-shop-cluster')
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/1sGu7/BadmintonWeb.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                # Cài đặt mongosh nếu chưa có
                if ! command -v mongosh &> /dev/null; then
                    echo "Installing mongosh..."
                    sudo apt update
                    sudo apt install -y gnupg curl
                    curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
                    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
                    sudo apt update
                    sudo apt install -y mongodb-mongosh
                fi
                '''
            }
        }
        
        stage('Verify MongoDB Connection') {
            steps {
                sh '''
                echo "Verifying MongoDB connection..."
                mongosh "${MONGODB_URI}" --eval "db.runCommand({ping:1})"
                '''
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
                # Dừng dịch vụ chiếm port nếu cần
                sudo systemctl stop nginx apache2 || true
                sleep 2
                
                # Triển khai ứng dụng
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
            cleanWs()
        }
        success {
            slackSend channel: '#deployments', 
                      message: "SUCCESS: Deployment ${BUILD_URL} completed"
        }
        failure {
            slackSend channel: '#deployments', 
                      message: "FAILED: Deployment ${BUILD_URL} failed"
            sh 'docker-compose down || true'
        }
    }
}
