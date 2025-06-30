pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_ATLAS_URI')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/1sGu7/BadmintonWeb.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }
        
        stage('Verify') {
            steps {
                sh 'sleep 10'
                sh 'curl -I http://localhost:80/products'
            }
        }
    }
}