# output "s3_user_access_key" {
#   value = aws_iam_access_key.media_user_key.id
# }

# output "s3_user_secret_key" {
#   value = aws_iam_access_key.media_user_key.secret
# }


output "ec2_public_ip" {
  value = aws_instance.backend.public_ip
}

output "ec2_public_dns" {
  value = aws_instance.backend.public_dns
}
