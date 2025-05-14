# MERN Blog Deployment with Terraform & Ansible

This project represents a full-stack MERN (MongoDB, Express.js, React, Node.js) application deployment architecture using Terraformfor infrastructure provisioning and *Ansible* for configuration management.

## Project Goal

To automate the deployment of a scalable and production-ready MERN blog application on AWS using Infrastructure as Code (IaC) principles.

## Tools & Technologies

- Terraform: To provision EC2 instances, S3 buckets, security groups, and networking configurations.
- Ansible: To install and configure Node.js, MongoDB, NGINX, and PM2, and to deploy the application components automatically.
- *AWS*: The cloud provider used for hosting all infrastructure resources.
- *GitHub*: For source code management and version control.

## Project Structure

- terraform/: Contains all Terraform files for infrastructure provisioning.
- ansible/: Includes playbooks, roles, and inventory files for server configuration.
- frontend/ and backend/: Source code for the MERN application.

## Deployment Process

1. Terraform: provisions the necessary AWS infrastructure:
   - EC2 instances for frontend, backend, and MongoDB.
   - S3 buckets for media and static content.
   - Security groups and VPC networking.

2. Ansible:  is then used to configure each instance:
   - Installs required packages and dependencies.
   - Sets up reverse proxy with NGINX.
   - Deploys the Node.js app with PM2 process manager.

## Current Status

The Ansible roles and playbooks are fully prepared and tested locally. Due to constraints related to cloud runtime limits and file size restrictions during remote deployment (e.g., provider plugin files exceeding GitHub's file size limits), the **full automated deployment could not be completed remotely at this time.

However, all necessary files, logic, and configurations are available and ready to be executed in any compatible environment with minimal adjustments.

## Next Steps & Suggestions

- Clone the repository to a local machine with AWS CLI and credentials configured.
- Run the Terraform and Ansible steps manually or through CI/CD pipeline.
- Ensure Git LFS is used for any large binaries if needed.
.

---

> Note:i hope thus project highlights the infrastructure and automation skills rather than the application logic itself. All provisioning logic and automation are in place and ready to be scaled or integrated with CI/CD in the future.
