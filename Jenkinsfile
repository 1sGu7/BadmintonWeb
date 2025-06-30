pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_ATLAS_URI')
        APP_PORT = "3000"
        DOMAIN = "your-domain.com" // Thay bằng domain của bạn
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/1sGu7/BadmintonWeb.git'
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
        
        stage('Configure Nginx') {
            steps {
                sh '''
                # Tạo cấu hình Nginx reverse proxy
                echo "server {
                    listen 80;
                    server_name ${DOMAIN};

                    location / {
                        proxy_pass http://localhost:${APP_PORT};
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade \$http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header Host \$host;
                        proxy_cache_bypass \$http_upgrade;
                    }
                }" | sudo tee /etc/nginx/sites-available/badminton-shop
                
                # Kích hoạt cấu hình
                sudo ln -s /etc/nginx/sites-available/badminton-shop /etc/nginx/sites-enabled/ || true
                sudo nginx -t && sudo systemctl reload nginx
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                # Dừng container cũ nếu có
                docker-compose down || true
                
                # Triển khai ứng dụng
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
                    sleep 10
                    '''
                }
            }
        }
        
        stage('SSL Setup') {
            steps {
                sh '''
                # Cài đặt SSL miễn phí với Certbot
                sudo apt install -y certbot python3-certbot-nginx
                sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m your-email@example.com
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend channel: '#deployments', 
                      message: "SUCCESS: Deployment ${BUILD_URL} completed. Access: https://${DOMAIN}"
        }
        failure {
            slackSend channel: '#deployments', 
                      message: "FAILED: Deployment ${BUILD_URL} failed"
            sh 'docker-compose logs || true'
        }
    }
}
