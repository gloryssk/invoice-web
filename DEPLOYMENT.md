# Invoice Web Viewer - 프로덕션 배포 가이드

**최종 업데이트**: 2026-03-04
**상태**: 배포 준비 완료 (MVP 완성)
**버전**: 1.0.0

---

## 📋 배포 전 체크리스트

### ✅ 로컬 검증 완료

- [x] `npm run check-all` 통과 (typecheck, lint, format)
- [x] `npm run build` 성공 (First Load JS: 112KB)
- [x] 보안 헤더 설정 완료 (`next.config.ts`)
- [x] SEO 최적화 완료 (robots.txt, sitemap.ts, OG 태그)
- [x] 환경변수 템플릿 작성 (`.env.example`)
- [x] API 라우트 인증 구현 (쿠키 기반 세션)
- [x] 전체 파일 구조 검증

---

## 🚀 Vercel 배포 단계

### Step 1: GitHub 연동 및 저장소 설정

1. **GitHub 저장소 확인**

   ```bash
   git remote -v
   # origin  https://github.com/YOUR_USERNAME/invoice-web.git (fetch)
   # origin  https://github.com/YOUR_USERNAME/invoice-web.git (push)
   ```

2. **Vercel 프로젝트 생성**
   - Vercel 대시보드 접속: https://vercel.com/dashboard
   - "Add New..." → "Project"
   - GitHub 저장소 선택 및 연동
   - 프로젝트명: `invoice-web`

### Step 2: 환경변수 설정 (필수!)

Vercel 프로젝트 설정 → Environment Variables

**필수 환경변수:**

| 변수명                  | 값                       | 설명                                                               |
| ----------------------- | ------------------------ | ------------------------------------------------------------------ |
| `NOTION_TOKEN`          | `ntn_...`                | 노션 API 토큰 ([생성 링크](https://www.notion.so/my-integrations)) |
| `NOTION_INVOICES_DB_ID` | `123abc...`              | 견적서 데이터베이스 ID                                             |
| `NOTION_ITEMS_DB_ID`    | `456def...`              | 견적 항목 데이터베이스 ID                                          |
| `ADMIN_PASSWORD_HASH`   | `$2a$10$...`             | bcrypt 해시된 관리자 비밀번호                                      |
| `NEXT_PUBLIC_APP_URL`   | `https://yourdomain.com` | 프로덕션 도메인 URL                                                |

**해시 생성 방법:**

```bash
# 로컬에서 bcrypt 해시 생성
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
# 출력: $2a$10$...복잡한문자열...
```

**환경변수 설정 순서:**

1. Vercel 프로젝트 Settings 탭
2. Environment Variables 섹션
3. 각 변수를 하나씩 추가 (이름 = 값)
4. 'Save' 클릭
5. **선택사항**: 개발/프로덕션 환경별 구분 (Standard plan 이상)

### Step 3: 도메인 설정 (선택사항)

**기본 Vercel 도메인 사용:**

- 배포 후 기본 제공 URL: `https://invoice-web.vercel.app`
- 즉시 사용 가능

**커스텀 도메인 설정:**

1. Vercel 프로젝트 → Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력 (예: `invoice.example.com`)
4. DNS 레코드 설정 (Vercel 가이드 따라)
   - DNS 제공자에서 CNAME 또는 A 레코드 추가
   - 반영 시간: 24시간 이내

**DNS 레코드 예시 (Route53 기준):**

```
Name: invoice.example.com
Type: CNAME
Value: cname.vercel-dns.com
```

### Step 4: 배포

**자동 배포:**

- GitHub main 브랜치에 push
- Vercel이 자동으로 감지 후 빌드 및 배포
- 배포 완료 후 메일 수신

**수동 배포:**

1. Vercel 대시보드의 프로젝트 선택
2. "Deployments" 탭
3. "Deploy" 버튼 클릭

**배포 상태 확인:**

```bash
# 로컬에서 Vercel CLI 사용 (설치: npm i -g vercel)
vercel logs --follow
```

### Step 5: 배포 후 검증

배포 완료 후 다음 항목 확인:

**프로덕션 환경 테스트:**

1. **기본 기능**
   - [ ] 공개 링크 접근: `https://yourdomain.com/view/sample-slug`
   - [ ] 견적서 조회 및 렌더링
   - [ ] PDF 다운로드 기능
   - [ ] 인쇄 기능 (Ctrl+P)

2. **관리자 기능**
   - [ ] 관리자 대시보드 접근: `https://yourdomain.com/dashboard`
   - [ ] 로그인 성공 (환경변수에 설정한 비밀번호)
   - [ ] 견적서 목록 조회
   - [ ] 링크 복사 기능
   - [ ] 미리보기 버튼

3. **보안 검증**
   - [ ] HTTPS 적용 확인 (주소창 자물쇠)
   - [ ] 보안 헤더 확인
     ```bash
     curl -I https://yourdomain.com
     # 다음 헤더 포함 확인:
     # - Content-Security-Policy
     # - Strict-Transport-Security
     # - X-Frame-Options: DENY
     ```

4. **SEO 검증**
   - [ ] robots.txt 접근: `https://yourdomain.com/robots.txt`
   - [ ] sitemap.xml 생성: `https://yourdomain.com/sitemap.xml`
   - [ ] OG 태그 확인 (Link Preview 도구: https://www.opengraph.xyz/)

5. **성능 검증**
   - [ ] Lighthouse 점수 확인 (90+ 목표)
     ```bash
     # 온라인 도구
     https://pagespeed.web.dev/
     ```

---

## 📊 성능 최적화 결과

**빌드 통계:**

- First Load JS (shared): 112 kB ✅
- Middleware: 39.1 kB
- 정적 페이지: 3개 사전 생성

**SEO 최적화:**

- ✅ Open Graph 태그
- ✅ Twitter Card 메타데이터
- ✅ 동적 sitemap 생성
- ✅ robots.txt 설정

**보안 강화:**

- ✅ Content Security Policy (CSP)
- ✅ HSTS (HTTP Strict-Transport-Security)
- ✅ X-Frame-Options: DENY
- ✅ Permissions-Policy 제한

---

## 🔐 환경변수 보안 체크

**✅ 로컬 보안 (`.env.local`):**

- `.gitignore`에 등록되어 Git 제외
- 민감정보 포함 (NOTION_TOKEN, ADMIN_PASSWORD_HASH)

**✅ 프로덕션 보안 (Vercel):**

- Vercel 대시보드에서만 관리
- 배포 시 자동 주입
- 클라이언트 코드에 노출되지 않음

**환경변수 확인 (프로덕션):**

```typescript
// ✅ 안전 (서버 전용)
const token = process.env.NOTION_TOKEN

// ⚠️ 위험 (클라이언트에 노출)
const publicUrl = process.env.NEXT_PUBLIC_APP_URL // ← NEXT_PUBLIC_ 접두사 필요
```

---

## 📈 모니터링 (선택사항)

### Vercel Analytics (무료)

1. Vercel 프로젝트 → Analytics
2. "Enable Web Analytics" 클릭
3. 자동으로 활성화됨

### Sentry (버그 추적)

1. [Sentry 회원가입](https://sentry.io/)
2. 새 프로젝트 생성 (Next.js)
3. DSN 복사
4. Vercel 환경변수에 추가:
   - `SENTRY_DSN` = DSN 값
   - `SENTRY_AUTH_TOKEN` = 인증 토큰

---

## 🆘 배포 문제 해결

### 빌드 실패

**"노션 데이터베이스 ID가 설정되지 않았습니다"**

- 원인: 환경변수 미설정
- 해결: Vercel 대시보드에서 `NOTION_INVOICES_DB_ID` 설정 후 재배포

### 화이트 라벨 에러

**"Internal Server Error"**

- 확인: Vercel 로그 확인
  ```bash
  vercel logs --follow
  ```
- 일반적 원인:
  - 환경변수 누락
  - 노션 API 토큰 만료
  - 데이터베이스 구조 변경

### 링크 복사 실패

**"복사 실패 문제"**

- HTTPS 필수 (클립보드 API 보안 요구)
- 커스텀 도메인이 HTTPS로 설정되었는지 확인

---

## 📝 배포 후 체크리스트

- [ ] 프로덕션 URL 공유 준비
- [ ] 클라이언트에 링크 전달 방법 안내
- [ ] 관리자 비밀번호 안전한 채널로 전달
- [ ] 모니터링 설정 (선택)
- [ ] 백업 계획 수립 (노션 API 의존성)

---

## 🔄 지속적 배포

**GitHub 워크플로우:**

1. 로컬 개발 및 테스트

   ```bash
   npm run dev
   npm run check-all
   npm run build
   ```

2. 커밋 및 푸시

   ```bash
   git add .
   git commit -m "✨ 기능명 추가"
   git push origin main
   ```

3. Vercel 자동 배포
   - GitHub 푸시 감지
   - 자동 빌드 및 테스트
   - 성공 시 배포

---

## 📞 지원 및 문서

- **Next.js 공식 문서**: https://nextjs.org/docs
- **Vercel 배포 가이드**: https://vercel.com/docs
- **노션 API 문서**: https://developers.notion.com/
- **프로젝트 PRD**: `./docs/PRD.md`

---

**작성일**: 2026-03-04
**프로젝트**: Invoice Web Viewer MVP
**버전**: 1.0.0
