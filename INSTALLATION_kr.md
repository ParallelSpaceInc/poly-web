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

Poly 서버를 구축하려면 다음 단계를 수행하십시오.

- 리포지토리 복제 및 노드 패키지 설치
- Poly 서버용 S3Server 준비
- Google 및 Github에서 OAuth ID 생성
- .env 파일 업데이트
- 폴리 서버 실행

### Cloning repository

Poly 저장소를 복제하려면 아래 명령을 실행하십시오.


```bash
$ git clone --depth=1 https://github.com/parallelspaceRE/poly-web
$ cd poly-web
$ npm install
```


### Preparing S3 Server

AWS S3를 사용하면 AWS 정책에 따라 요금이 부과될 수 있습니다.

Poly 서버용 새 S3 버킷을 생성합니다.

### Creating OAuth ID

다음 단계는 도메인 이름이 poly-web.com 인 서버에 대한 안내입니다.

도메인이 없고 테스트를 위해 서버를 실행하려는 경우 도메인 이름을 http://localhost:3000 으로 바꿀 수 있습니다 .

#### Google

[Google Cloud console](https://console.cloud.google.com/apis/credentials) 에서 OAuth 2.0 클라이언트 ID 만들기

- 자격 증명 만들기 -> OAuth 클라이언트 ID를 클릭 합니다.
- 웹 애플리케이션 선택 
- 승인된 JavaScript 출처에 대해 https://poly-web.com 입력 
- 승인된 리디렉션 URI에 대해 https://poly-web.com/api/auth/callback/google 을 입력 합니다. 
- 만들기 버튼 클릭 
- 클라이언트 ID와 비밀 메모

#### Github

[Github Developer settings](https://github.com/settings/developers) 에서 OAuth ID 생성

- 새 OAuth 앱 클릭 
- 앱 이름 채우기 
- 홈페이지 URL에 https://poly-web.com 입력 
- 승인된 콜백 URI에 대해 https://poly-web.com/api/auth/callback/github 채우기 
- 신청 등록 클릭 
- 새 클라이언트 암호 생성을 클릭 한 다음 암호와 클라이언트 ID를 메모합니다.
