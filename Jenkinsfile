pipeline {
  agent any

  environment {
    ACR_NAME         = "stagingacr1234"                          
    ACR_LOGIN_SERVER = "${ACR_NAME}.azurecr.io"
    IMAGE_TAG        = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'github_cre', url: 'https://github.com/Cuong312004/mini-e-commerce-app-microservices.git', branch: 'main'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
            def scannerHome = tool 'sonar-scanner'
            sh "${scannerHome}/bin/sonar-scanner"
        }
      }
    }

    stage('Login to ACR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'acr_cre', usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
          sh '''
            echo "$ACR_PASS" | docker login $ACR_LOGIN_SERVER -u "$ACR_USER" --password-stdin
          '''
        }
      }
    }

    stage('Build & Push: Auth Service') {
      steps {
        sh """
          docker build -t $ACR_LOGIN_SERVER/auth-service:$IMAGE_TAG App/backend/auth-service
          docker push $ACR_LOGIN_SERVER/auth-service:$IMAGE_TAG
        """
      }
    }

    stage('Build & Push: Product Service') {
      steps {
        sh """
          docker build -t $ACR_LOGIN_SERVER/product-service:$IMAGE_TAG App/backend/product-service
          docker push $ACR_LOGIN_SERVER/product-service:$IMAGE_TAG
        """
      }
    }

    stage('Build & Push: Order Service') {
      steps {
        sh """
          docker build -t $ACR_LOGIN_SERVER/order-service:$IMAGE_TAG App/backend/order-service
          docker push $ACR_LOGIN_SERVER/order-service:$IMAGE_TAG
        """
      }
    }

    stage('Build & Push: Frontend') {
      steps {
        sh """
          docker build -t $ACR_LOGIN_SERVER/frontend:$IMAGE_TAG App/frontend
          docker push $ACR_LOGIN_SERVER/frontend:$IMAGE_TAG
        """
      }
    }

    stage('Update GitOps Repo') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github_cre', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
          sh '''
            rm -rf DevSecOps-e-commerce-app
            git clone https://$GIT_PASS@github.com/Cuong312004/DevSecOps-e-commerce-app.git
            cd DevSecOps-e-commerce-app/argocd/base

            # Update image tag in each deployment
            sed -i "s|auth-service:.*|auth-service:$IMAGE_TAG|g" auth-service/deployment.yaml
            sed -i "s|product-service:.*|product-service:$IMAGE_TAG|g" product-service/deployment.yaml
            sed -i "s|order-service:.*|order-service:$IMAGE_TAG|g" order-service/deployment.yaml
            sed -i "s|frontend:.*|frontend:$IMAGE_TAG|g" frontend/deployment.yaml

            git config user.email "jenkins@auto.com"
            git config user.name "Jenkins"

            git add .
            git commit -m "Update image tag to $IMAGE_TAG from Jenkins build #$BUILD_NUMBER"
            git push origin main
          '''
        }
      }
    }


    stage('Clean up') {
      steps {
        sh 'docker logout $ACR_LOGIN_SERVER'
        echo "All images built and pushed with tag: $IMAGE_TAG"
      }
    }
  }
}
