# About

Poly 프로젝트를 구동하는 방법에 대해 설명합니다.

## 필요 자원

- AWS ec2 instance (최소사양)
  - RAM : 4GB 이상
  - SSD : 30GB 이상
  - CPU Architecture : x86
  - OS : Ubuntu
- AWS S3 Bucket
  - 모델 데이터 저장소
- 서버 운영자 소유의 Domain 주소
- MySQL DB
  - Docker container나 Plenet Scale 등의 서비스 사용 가능

## 필요한 자원 준비하기

### AWS ec2

1. https://aws.amazon.com/ 에 접속하여 아이디를 생성후 로그인한다.

2. 좌측 상단의 서비스에서 ec2 항목을 찾아 접속한 뒤 인스턴스 시작 버튼을 누른다.

3. 앱 이미지로 Ubuntu 를 선택하고 인스턴스 유형으로 위에 기술한 최소사양 이상의 인스턴스를 선택한다.

4. 키페어를 새로 생성하거나 기존의 키페어를 사용한다. 새로운 키페어를 생성하는 경우에 파일을 보안이 갖추어진 폴더에 저장한다.

5. Allow https Traffic 에 체크한다.

6. 스토리지 구성시 30 GB 이상의 용량을 입력한다.

7. 인스턴스 시작을 눌러 인스턴스를 생성한다.

인스턴스에 접속하기 위해서는 명령 프롬프트(cmd, bash 등)에서 `$ ssh ubuntu@<인스턴스 IP> -i <키페어 경로>` 를 입력해 접속할 수 있다.

윈도우 운영체제에서는 C:\\Users\\<user>\\.ssh 폴더를 탐색하여 키를 사용한다.

접속예제 : `$ ssh ubuntu@10.250.250.250`

### 탄력적 IP 사용

1. 인스턴스에 고정적인 IP를 부여하기 위해 탄력적 IP 항목에 접근한다.

2. 탄력적 IP 주소 할당버튼을 누른다.

3. 인스턴스가 생성된 지역을 누르고 할당을 누른다.

4. 새로 생성된 탄력적 주소를 체크표시 한 뒤 작업 버튼을 눌러 탄력적 IP 주소 연결을 선택한다.

5. 위에서 생성한 인스턴스를 선택하고 연결을 누른다.

6. 이후 DNS 서비스를 연결하기 전까지 탄력적 IP 를 이용해 인스턴스에 접속한다.

### AWS S3 bucket

1. 좌상단의 검색창을 사용해 S3 서비스에 접근한다.

2. 화면 우측의 버킷만들기 버튼을 누르고 버킷 이름을 설정한다.

3. AWS 리전을 주 사용자가 위치한 곳으로 설정한다.

4. 객체 소유권은 ACL 비활성화됨으로 설정한다.

5. 모든 퍼블릭 엑세스 차단 항목을 비활성화 하고 아래의 확인 문구에 체크표시한다.

6. 나머지 항목은 처음상태로 두고 버킷 만들기를 누른다.

7. 새로 생성된 버킷을 누른뒤 권한 항목으로 넘어간다.

8. 버킷정책에서 편집버튼을 누르고 다음 항목을 붙여넣는다. <버킷명> 부분을 만든 버킷 이름으로 대체한다.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::<버킷명>/*"
        }
    ]
}
```

9.  CORS 항목에서 편집을 누르고 다음 항목을 추가한다.

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "localhost"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ]
    }
]
```

### MySQL

### Domain Name Service

### https

### Social login API

### Poly project settings and build

## 서버 구동하기

## Build server

To build you Poly Server, perform the following steps.

- Clone repository and install node packages
- Prepare S3Server for Poly server
- Create OAuth ID from Google and Github
- Update .env file
- Run Poly Server

### Cloning repository

To clone Poly repository, execute the commands below.

```bash
$ git clone --depth=1 https://github.com/parallelspaceRE/poly-web
$ cd poly-web
$ npm install
```

### Preparing S3Server

Using AWS S3 may be charged under AWS policy.

Create new S3 Bucket for Poly server.

### Creating OAuth ID

Following steps are guides for server which domain name is **poly-web.com**

If you don't have domain and want to run server for test, you can replace domain name to **http://localhost:3000**.

#### Google

Create OAuth 2.0 Client ID from [Google Cloud console](https://console.cloud.google.com/apis/credentials)

- Click _Create Credentials_ -> OAuth client ID
- Selecet _Web application_
- Fill **https://poly-web.com** for Authorized JavaScript origins
- Fill **https://poly-web.com/api/auth/callback/google** for Authorized redirect URIs
- Click _Create_ Button
- Memo your client id and Secret

#### Github

Create OAuth ID from [Github Developer settings](https://github.com/settings/developers)

- Click _New OAuth App_
- Fill App name
- Fill **https://poly-web.com** for Homepage URL
- Fill **https://poly-web.com/api/auth/callback/github** for Authorized callback URIs
- Click _Register application_
- Click _Generate a new client secret_ then memo the secret and Client ID
