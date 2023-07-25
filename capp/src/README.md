# 자동차 견적 api

1. ID / 비밀번호로 가입
2. 연식, 모델, 마일리지 등 기반으로 검사 가능
3. 유저는 자기 차가 어떻게 팔렸는지 리포트 볼 수 있음
4. 관리자는 기록된 판매를 검토, 승인


## 구현해야 하는 동작 목록
동작 | 메서드 | 경로
|-|-|-|
|로그인 | POST  | /auth/signin |
|ID 생성 | POST | /auth/signup |
|레포트 읽기 | GET | /reports |
|레포트 작성 | POST | /reports |
|레포트 수정 | POST | /reports/:id |

## 필요한 모듈들

- 유저 모듈(User Controller / Service / Repository)  
- 레포트 모듈(Report Controller / Service / Repository)