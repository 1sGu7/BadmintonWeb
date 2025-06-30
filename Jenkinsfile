pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb+srv://shop_user:shop_password@badminton-shop-cluster.wcjjhqv.mongodb.net/?retryWrites=true&w=majority&appName=badminton-shop-cluster')
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
                    sudo apt-get update -y
                    sudo apt-get install -y mongodb-clients
                '''
            }
        }

        stage('Verify MongoDB Connection') {
            steps {
                script {
                    try {
                        sh """
                            echo "Testing MongoDB connection to ${env.MONGODB_URI}"
                            mongosh "${env.MONGODB_URI}" --eval "db.runCommand({ping:1})"
                        """
                    } catch (e) {
                        error("MongoDB connection failed: ${e.getMessage()}")
                    }
                }
            }
        }
        
        // Thêm các stage build/deploy khác tại đây
    }

    post {
        always {
            node {
                cleanWs()
            }
        }
        failure {
            echo 'Build failed!'
        }
        success {
            echo 'Build succeeded!'
        }
    }
}
