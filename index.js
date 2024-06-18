name: Build, Scan, and Upload Docker Image to GCR

on:
  push:
    branches:
      - main

jobs:
  build_and_scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Log in to Google Cloud
      uses: google-github-actions/auth@v0.4.0
      with:
        credentials_json: ${{ secrets.GCP_SA_KEY }}

    - name: Configure Docker
      run: |
        gcloud auth configure-docker

    - name: Build Docker image
      run: |
        docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/hello-world-nodejs .

    - name: Push Docker image
      run: |
        docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/hello-world-nodejs

    - name: Trigger Container Analysis Scan
      run: |
        IMAGE_URI=gcr.io/${{ secrets.GCP_PROJECT_ID }}/hello-world-nodejs:latest
        gcloud container images describe $IMAGE_URI --format='value(image_summary.FULLY_QUALIFIED_DIGEST)' || exit 1
        gcloud beta container images scan $IMAGE_URI

    - name: Get Vulnerability Report
      run: |
        IMAGE_URI=gcr.io/${{ secrets.GCP_PROJECT_ID }}/hello-world-nodejs:latest
        gcloud beta container images list-vulnerabilities $IMAGE_URI --format=json > vulnerability_report.json
        cat vulnerability_report.json
