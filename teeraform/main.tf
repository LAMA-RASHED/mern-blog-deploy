provider "aws" {
  region = "eu-north-1"
}

# ---------------------------
# IAM for Media Uploads
# ---------------------------


# ---------------------------
# Security Group
# ---------------------------
resource "aws_security_group" "blog_sg" {
  name        = "blog-sg"
  description = "Allow SSH, HTTP, and app port"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow SSH access"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP access"
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow custom port access"
  }

  egress {
    from_port     = 0
    to_port       = 0
    protocol      = "-1"
    cidr_blocks   = ["0.0.0.0/0"]
    description   = "Allow all outbound traffic"
  }
}
# ---------------------------
# EC2 Instance
# ---------------------------
resource "aws_instance" "backend" {
  ami                    = "ami-0b3769708706590ac" # Ubuntu 22.04 (Stockholm eu-north-1)
  instance_type          = "t3.micro"
  key_name               = "lole"
  security_groups        = [aws_security_group.blog_sg.name]
  user_data              = file("init.sh")

  tags = {
    Name = "blog-backend"
  }
}

# ---------------------------
# S3 - Frontend Bucket
# ---------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = "lama-blog-frontend-20250514"
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "arn:aws:s3:::lama-blog-frontend-20250514/*"
    }]
  })
}

# ---------------------------
# S3 - Media Bucket
# ---------------------------
resource "aws_s3_bucket" "media" {
  bucket = "lama-blog-media-20250514"
}

resource "aws_s3_bucket_cors_configuration" "media_cors" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}