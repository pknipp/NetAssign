import boto3
from .config import Config

s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)
# boto3.set_stream_logger("botocore", level="DEBUG")


def upload_file(file_name, bucket, acl="public-read"):
    """
    Function to upload a file to an S3 bucket
    """
    # print("bucket = ", bucket)
    object_name = file_name
    # s3_client = boto3.client('s3')
    response = s3.upload_file(file_name, bucket, object_name, ExtraArgs={
        "ACL": acl,
    })

    return response


def download_file(file_name, bucket):
    """
    Function to download a given file from an S3 bucket
    """
    # s3 = boto3.resource('s3')
    output = f"downloads/{file_name}"
    s3.Bucket(bucket).download_file(file_name, output)

    return output


def list_files(bucket):
    """
    Function to list files in a given S3 bucket
    """
    s3 = boto3.client('s3')
    contents = []
    for item in s3.list_objects(Bucket=bucket)['Contents']:
        contents.append(item)

    return contents
