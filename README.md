# ci-cd-restro-app 
Learning CI/CD practices by implementing them on a restaurant booking app. 

[![Deploy code](https://github.com/Sanjay-George/ci-cd-restro-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/Sanjay-George/ci-cd-restro-app/actions/workflows/deploy.yml)
[![Build Backend](https://github.com/Sanjay-George/ci-cd-restro-app/actions/workflows/build_backend.yml/badge.svg)](https://github.com/Sanjay-George/ci-cd-restro-app/actions/workflows/build_backend.yml)
[![Build Frontend](https://github.com/Sanjay-George/ci-cd-restro-app/actions/workflows/build_frontend.yml/badge.svg)](https://github.com/Sanjay-George/ci-cd-restro-app/actions/workflows/build_frontend.yml)

# CI / CD pipelines ⚙️

## Build pipeline      
![build-pipeline drawio(3)](https://github.com/Sanjay-George/ci-cd-restro-app/assets/10389062/57dbe1f4-6da6-4447-b371-4f3743615171)


## Release pipeline
![build-pipeline drawio(2)](https://github.com/Sanjay-George/ci-cd-restro-app/assets/10389062/e193a266-bda9-48b4-93a2-cec0cac1f54d)


# Tools and frameworks 🚜
### Automation and Cloud
- Ansible
- GitHub Actions
- Docker
- Microsoft Azure (for cloud resources)
  
![image](https://github.com/Sanjay-George/ci-cd-restro-app/assets/10389062/ae85f3d2-11c5-4937-b741-85a9a1f92dc1)

### Web Application
- React
- NodeJS
- MySQL

# Learning Outcomes 💡

- Understand how to set up infrastructure with Ansible playbook(s)
- Configure NGINX, Node and other tools for serving the site with Ansible playbook(s)
- Continuous Integration with GitHub Actions
- Continuous Deployment with GitHub Actions and Ansible

# Infrastructure 🏗️

- Server
    - NGINX
    - NodeJS
- [Azure DB for MySQL](https://azure.microsoft.com/en-in/products/mysql)

# References
- [My Ansible basics repository](https://github.com/Sanjay-George/learn-ansible)
- Azure 
    - https://learn.microsoft.com/en-us/azure/developer/ansible/install-on-linux-vm?tabs=azure-cli#create-azure-credentials
    - https://learn.microsoft.com/en-us/azure/developer/ansible/vm-configure?tabs=ansible
- Github Actions
    - https://docs.github.com/en/actions/creating-actions/dockerfile-support-for-github-actions
    - https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action#testing-out-your-action-in-a-workflow
- Ansible
    - https://docs.ansible.com/ansible/latest/collections/azure/azcollection/azure_rm_resource_module.html
