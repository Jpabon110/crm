# Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
# except in compliance with the License. A copy of the License is located at
#
#     http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is distributed on an "AS IS"
# BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under the License.
"""
A BitBucket Builds template for deploying an application revision to AWS CodeDeploy
narshiva@amazon.com
v1.0.0
"""
from __future__ import print_function
import os
import sys
from time import strftime, sleep
import boto3
from botocore.exceptions import ClientError

VERSION_LABEL = strftime("%Y%m%d%H%M%S")
BUCKET_KEY = os.getenv('APPLICATION_NAME') + '/' + 'bitbucket_builds.zip'

def upload_to_s3(artifact):
    """
    Uploads an artifact to Amazon S3
    """
    try:
        client = boto3.client('s3')
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False
    try:
        client.put_object(
            Body=open(artifact, 'rb'),
            Bucket=os.getenv('S3_BUCKET_STG'),
            Key=BUCKET_KEY
        )
    except ClientError as err:
        print("Failed to upload artifact to S3.\n" + str(err))
        return False
    except IOError as err:
        print("Failed to access artifact.zip in this directory.\n" + str(err))
        return False
    return True

def main():
    if not upload_to_s3('/tmp/artifact.zip'):
        sys.exit(1)

if __name__ == "__main__":
    main()
