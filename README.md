# Creative AI Studio

AI 기반 마케팅 콘텐츠 생성 도구

## 기능

- 🎨 **배너 생성**: 상품 이미지를 PC/모바일 마케팅 배너로 변환
- 📷 **촬영컷 생성**: AI 기반 상품 촬영 이미지 생성
- 📄 **기획서 생성**: 엑셀 파일로 컨플루언스 기획서 자동 생성

## 시작하기

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. 이 저장소를 import하거나 폴더를 업로드
4. "Deploy" 클릭

또는 Vercel CLI 사용:

```bash
npm i -g vercel
vercel
```

## 기술 스택

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)

## 프로젝트 구조

```
creative-ai-studio/
├── pages/
│   ├── _app.js          # App wrapper
│   └── index.js         # 메인 페이지
├── styles/
│   └── globals.css      # 전역 스타일
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 라이선스

MIT
