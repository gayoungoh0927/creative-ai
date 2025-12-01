import React, { useState } from 'react';
import Head from 'next/head';
import { 
  Home, Image, Camera, FileText, FolderOpen, Settings, HelpCircle,
  Upload, Sparkles, Send, Download, Save, Clock, Check,
  Loader2, X, Plus, ChevronRight, ChevronDown, Monitor, Smartphone,
  Columns, ZoomIn, ZoomOut, Heart, RotateCcw, Search, Filter,
  Layout, Palette, Move, Grid3X3, MessageSquare, Eye, ArrowRight,
  Lightbulb, Bell, User, MoreHorizontal, Star, Calendar, Tag,
  Copy, Trash2, ExternalLink, Layers, Type, Wand2, BookOpen,
  Target, TrendingUp, Users, Megaphone, PenTool, ImagePlus,
  MoreVertical, Edit3, Share2, FileSpreadsheet, Lock, Link
} from 'lucide-react';

// 도구 설정
const TOOLS = {
  banner: {
    id: 'banner',
    name: '배너 생성',
    icon: Image,
    color: 'violet',
    bgGradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    textColor: 'text-violet-700',
    description: '상품 이미지 → PC/모바일 마케팅 배너',
    fullDescription: 'PC 및 모바일에 최적화된 배너를 생성합니다'
  },
  shooting: {
    id: 'shooting',
    name: '촬영컷 생성',
    icon: Camera,
    color: 'amber',
    bgGradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    description: '상품 이미지 → AI 스타일 촬영 사진',
    fullDescription: 'AI 기반 상품 촬영 이미지를 생성합니다'
  },
  planning: {
    id: 'planning',
    name: '기획서 생성',
    icon: FileText,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    description: '제안서 엑셀 → 컨플루언스 기획서',
    fullDescription: '엑셀 파일로 컨플루언스 기획서를 자동 생성합니다'
  }
};

// 샘플 프로젝트 데이터 (더 많은 데이터)
const MOCK_PROJECTS = [
  { id: 1, name: '여름 세일 배너', tool: 'banner', updatedAt: '25.01.15' },
  { id: 2, name: '신상품 히어로 촬영컷', tool: 'shooting', updatedAt: '25.01.15' },
  { id: 3, name: '3분기 캠페인 기획서', tool: 'planning', updatedAt: '25.01.14' },
  { id: 4, name: '모바일 프로모션 배너', tool: 'banner', updatedAt: '25.01.13' },
  { id: 5, name: '라이프스타일 상품 촬영', tool: 'shooting', updatedAt: '25.01.12' },
  { id: 6, name: '런칭 전략 기획서', tool: 'planning', updatedAt: '25.01.08' },
  { id: 7, name: '겨울 시즌 배너', tool: 'banner', updatedAt: '25.01.07' },
  { id: 8, name: '제품 상세 촬영컷', tool: 'shooting', updatedAt: '25.01.01' },
  { id: 9, name: '연간 마케팅 계획서', tool: 'planning', updatedAt: '24.12.28' },
  { id: 10, name: '블랙프라이데이 배너', tool: 'banner', updatedAt: '24.12.20' },
];

export default function UnifiedAIWorkspace() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentTool, setCurrentTool] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProjectMenu, setShowNewProjectMenu] = useState(false);
  
  // 도구별 상태
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [viewMode, setViewMode] = useState('pc');
  const [chatInput, setChatInput] = useState('');
  const [editHistory, setEditHistory] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCrossToolModal, setShowCrossToolModal] = useState(false);
  const [workModes, setWorkModes] = useState(['expand']); // 다중 선택 가능
  const [customPrompt, setCustomPrompt] = useState('');
  const [textBold, setTextBold] = useState(true);
  const [selectedTextField, setSelectedTextField] = useState(null); // 'headline', 'subheadline', 'cta'
  const [textStyles, setTextStyles] = useState({
    headline: 'bold',
    subheadline: 'regular',
    cta: 'bold'
  });

  // 기획서 생성 도구 상태
  const [selectedTeam, setSelectedTeam] = useState('');
  const [uploadedExcelFile, setUploadedExcelFile] = useState(null);
  const [isDraftGenerated, setIsDraftGenerated] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  
  // 기획서 항목 (기본 항목 + 사용자 추가 항목)
  const defaultPlanningItems = [
    { id: 'committee', title: '커미티', isDefault: true },
    { id: 'productName', title: '상품명', isDefault: true },
    { id: 'productFeatures', title: '상품 특장점', isDefault: true },
    { id: 'options', title: '선택사항', isDefault: true },
    { id: 'notices', title: '안내사항', isDefault: true },
  ];
  const [planningItems, setPlanningItems] = useState(defaultPlanningItems);
  const [draftValues, setDraftValues] = useState({});
  
  const [confluenceResult, setConfluenceResult] = useState({
    isGenerated: false,
    url: '',
    isGenerating: false
  });

  // 기획서 항목 추가
  const addPlanningItem = () => {
    const newItem = {
      id: `custom_${Date.now()}`,
      title: '',
      isDefault: false
    };
    setPlanningItems([...planningItems, newItem]);
  };

  // 기획서 항목 제목 수정
  const updatePlanningItemTitle = (id, newTitle) => {
    setPlanningItems(planningItems.map(item => 
      item.id === id ? { ...item, title: newTitle } : item
    ));
  };

  // 기획서 항목 삭제
  const removePlanningItem = (id) => {
    setPlanningItems(planningItems.filter(item => item.id !== id));
    const newDraftValues = { ...draftValues };
    delete newDraftValues[id];
    setDraftValues(newDraftValues);
  };

  // 초안 값 업데이트
  const updateDraftValue = (id, value) => {
    setDraftValues({ ...draftValues, [id]: value });
  };

  // AI 초안 생성
  const generateDraft = () => {
    setIsGeneratingDraft(true);
    setTimeout(() => {
      const generatedValues = {};
      planningItems.forEach(item => {
        if (item.title) {
          // 각 항목에 대한 AI 생성 내용 (실제로는 API 호출)
          switch(item.id) {
            case 'committee':
              generatedValues[item.id] = 'CT-2024-Q3-001';
              break;
            case 'productName':
              generatedValues[item.id] = `[${selectedTeam}] 프리미엄 유기농 견과류 세트`;
              break;
            case 'productFeatures':
              generatedValues[item.id] = '• 100% 유기농 원료 사용\n• HACCP 인증 시설 생산\n• 무방부제, 무첨가물\n• 개별 소포장으로 신선도 유지';
              break;
            case 'options':
              generatedValues[item.id] = '• 500g 단품 / 1kg 대용량\n• 선물세트 (3종/5종)\n• 정기배송 할인 적용 가능';
              break;
            case 'notices':
              generatedValues[item.id] = '• 견과류 알러지 주의\n• 직사광선 피해 서늘한 곳 보관\n• 개봉 후 2주 이내 섭취 권장';
              break;
            default:
              // 사용자가 추가한 항목
              generatedValues[item.id] = `[AI 생성] ${item.title}에 대한 내용이 여기에 표시됩니다.\n\n• 관련 정보 1\n• 관련 정보 2\n• 관련 정보 3`;
          }
        }
      });
      setDraftValues(generatedValues);
      setIsDraftGenerated(true);
      setIsGeneratingDraft(false);
    }, 2000);
  };

  // 작업 방식 토글
  const toggleWorkMode = (mode) => {
    if (mode === 'custom') {
      // 직접 입력은 단독 토글
      if (workModes.includes('custom')) {
        setWorkModes(workModes.filter(m => m !== 'custom'));
      } else {
        setWorkModes([...workModes, 'custom']);
      }
    } else {
      // 다른 옵션들
      if (workModes.includes(mode)) {
        setWorkModes(workModes.filter(m => m !== mode));
      } else {
        setWorkModes([...workModes, mode]);
      }
    }
  };

  // 필터링된 프로젝트
  const filteredProjects = MOCK_PROJECTS.filter(p => {
    const matchesFilter = projectFilter === 'all' || p.tool === projectFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 네비게이션 핸들러
  const handleNavigation = (destination, tool = null) => {
    if (hasUnsavedChanges && currentView === 'tool') {
      setPendingNavigation({ destination, tool });
      setShowSaveModal(true);
    } else {
      executeNavigation(destination, tool);
    }
  };

  const executeNavigation = (destination, tool) => {
    setCurrentView(destination);
    if (tool) setCurrentTool(tool);
    setShowSaveModal(false);
    setPendingNavigation(null);
    if (destination !== 'tool') {
      setUploadedImages([]);
      setVariations([]);
      setEditHistory([]);
      setHasUnsavedChanges(false);
      // 기획서 생성 상태 초기화
      setSelectedTeam('');
      setUploadedExcelFile(null);
      setIsDraftGenerated(false);
      setPlanningItems(defaultPlanningItems);
      setDraftValues({});
      setConfluenceResult({
        isGenerated: false,
        url: '',
        isGenerating: false
      });
    }
  };

  const handleSaveAndNavigate = () => {
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      executeNavigation(pendingNavigation.destination, pendingNavigation.tool);
    }
  };

  // 도구 기능들
  const handleUpload = () => {
    const newImage = { id: Date.now(), name: `상품_${uploadedImages.length + 1}.png` };
    setUploadedImages([...uploadedImages, newImage]);
    setHasUnsavedChanges(true);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setVariations([
            { id: 1, style: '볼드 & 다이나믹' },
            { id: 2, style: '따뜻한 & 중앙 정렬' },
            { id: 3, style: '신선한 & 미니멀' }
          ]);
          
          // 히스토리에 일자/시간 기록
          const now = new Date();
          const modeLabels = [];
          if (workModes.includes('expand')) modeLabels.push('배경 확장');
          if (workModes.includes('changeBg')) modeLabels.push('배경 변경');
          if (workModes.includes('combine')) modeLabels.push('제품 합성');
          if (workModes.includes('custom')) modeLabels.push('직접 입력');
          const historyItem = {
            type: 'generate',
            message: currentTool === 'banner' ? `${modeLabels.join(' + ')} 생성` : '생성',
            date: now.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', ''),
            time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
            timestamp: now
          };
          setEditHistory(prev => [...prev, historyItem]);
          setHasUnsavedChanges(true);
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  const getProgressLabel = () => {
    if (!currentTool) return '';
    if (currentTool === 'banner') {
      // 작업 방식에 따른 진행 메시지 (첫 번째 선택된 모드 기준)
      const primaryMode = workModes[0] || 'expand';
      if (primaryMode === 'expand') {
        if (generationProgress < 25) return '제품 영역 분석 중...';
        if (generationProgress < 50) return '배경 영역 확장 중...';
        if (generationProgress < 75) return '자연스러운 연결 처리 중...';
        return '배너 마무리 중...';
      }
      if (primaryMode === 'changeBg') {
        if (generationProgress < 25) return '제품 분리 중...';
        if (generationProgress < 50) return '새로운 배경 생성 중...';
        if (generationProgress < 75) return '제품 합성 중...';
        return '배너 마무리 중...';
      }
      if (primaryMode === 'combine') {
        if (generationProgress < 25) return '제품 이미지 분석 중...';
        if (generationProgress < 50) return '레이아웃 구성 중...';
        if (generationProgress < 75) return '제품 배치 최적화 중...';
        return '배너 마무리 중...';
      }
      if (primaryMode === 'custom') {
        if (generationProgress < 25) return '요청사항 분석 중...';
        if (generationProgress < 50) return 'AI 배너 생성 중...';
        if (generationProgress < 75) return '디자인 적용 중...';
        return '배너 마무리 중...';
      }
    }
    if (currentTool === 'shooting') {
      if (generationProgress < 25) return '상품 분석 중...';
      if (generationProgress < 50) return '장면 생성 중...';
      if (generationProgress < 75) return '조명 적용 중...';
      return '디테일 보정 중...';
    }
    if (currentTool === 'planning') {
      if (generationProgress < 25) return '입력 정보 분석 중...';
      if (generationProgress < 50) return '시장 조사 중...';
      if (generationProgress < 75) return '섹션 작성 중...';
      return '문서 포맷팅 중...';
    }
  };

  // 작업 방식별 툴팁 메시지
  const getWorkModeTooltip = () => {
    if (workModes.length === 0) return '작업 방식을 선택해주세요';
    const labels = [];
    if (workModes.includes('expand')) labels.push('배경 확장');
    if (workModes.includes('changeBg')) labels.push('배경 텍스쳐 변경');
    if (workModes.includes('combine')) labels.push('제품 합성');
    if (workModes.includes('custom')) labels.push('직접 입력');
    return `${labels.join(' + ')} 방식으로 생성합니다`;
  };

  const getWorkModeLabel = () => {
    if (workModes.length === 0) return '생성';
    if (workModes.length === 1) {
      switch(workModes[0]) {
        case 'expand': return '배경 확장';
        case 'changeBg': return '배경 변경';
        case 'combine': return '제품 합성';
        case 'custom': return '직접 입력';
        default: return '생성';
      }
    }
    return `${workModes.length}개 방식`;
  };

  // 사이드바 렌더링
  const renderSidebar = () => (
    <aside className={`${sidebarCollapsed ? 'w-16' : 'w-56'} bg-gray-900 text-white flex flex-col transition-all duration-300 shrink-0`}>
      {/* 로고 */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800">
        {!sidebarCollapsed && <span className="font-bold text-lg">Creative AI</span>}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <ChevronRight size={18} className={`transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 py-4">
        <div className="px-3 mb-2">
          {!sidebarCollapsed && <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">메뉴</p>}
        </div>
        
        {/* 홈 */}
        <button
          onClick={() => handleNavigation('landing')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            currentView === 'landing' 
              ? 'bg-gray-800 text-white border-l-2 border-violet-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Home size={18} />
          {!sidebarCollapsed && '홈'}
        </button>

        {/* 도구 섹션 */}
        {!sidebarCollapsed && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-6 mb-2 px-5">도구</p>
        )}
        
        {Object.values(TOOLS).map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleNavigation('tool', tool.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              currentView === 'tool' && currentTool === tool.id
                ? 'bg-gray-800 text-white border-l-2 border-violet-500' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <tool.icon size={18} className={currentView === 'tool' && currentTool === tool.id ? `text-${tool.color}-400` : ''} />
            {!sidebarCollapsed && tool.name}
          </button>
        ))}
      </nav>

      {/* 사용자 섹션 */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">마케팅팀</p>
              <p className="text-xs text-gray-500">프로 플랜</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  // 홈 화면 (프로젝트 리스트 중심) 렌더링
  const renderLanding = () => (
    <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">내 프로젝트</h1>
            <p className="text-sm text-gray-500">생성한 모든 에셋을 한 곳에서 관리하세요</p>
          </div>
          
          {/* 새 프로젝트 버튼 (드롭다운) */}
          <div className="relative">
            <button 
              onClick={() => setShowNewProjectMenu(!showNewProjectMenu)}
              className="px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              새 프로젝트
              <ChevronDown size={16} className={`transition-transform ${showNewProjectMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {/* 드롭다운 메뉴 */}
            {showNewProjectMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNewProjectMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                  {Object.values(TOOLS).map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setShowNewProjectMenu(false);
                        handleNavigation('tool', tool.id);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`w-9 h-9 bg-gradient-to-br ${tool.bgGradient} rounded-lg flex items-center justify-center`}>
                        <tool.icon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{tool.name}</p>
                        <p className="text-xs text-gray-500">{tool.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 검색 및 필터 */}
        <div className="flex items-center gap-4">
          {/* 검색창 */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-white"
            />
          </div>
          
          {/* 필터 버튼들 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'all', label: '전체' },
              { id: 'banner', label: '배너 생성' },
              { id: 'shooting', label: '촬영컷 생성' },
              { id: 'planning', label: '기획서 생성' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setProjectFilter(filter.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  projectFilter === filter.id 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 프로젝트 리스트 */}
      <div className="flex-1 overflow-auto">
        {/* 리스트 헤더 */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex-1">프로젝트</div>
          <div className="w-28 text-center">유형</div>
          <div className="w-32 text-center">수정일</div>
          <div className="w-20"></div>
        </div>

        {/* 프로젝트 아이템들 */}
        <div className="divide-y divide-gray-100">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-400 mt-1">다른 검색어나 필터를 시도해보세요</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const tool = TOOLS[project.tool];
              return (
                <div
                  key={project.id}
                  className="bg-white hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    setCurrentTool(project.tool);
                    setCurrentView('tool');
                    setVariations([{ id: 1, style: '불러옴' }]);
                  }}
                >
                  <div className="px-6 py-4 flex items-center">
                    {/* 프로젝트명 */}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-violet-600 transition-colors">
                        {project.name}
                      </p>
                    </div>

                    {/* 유형 */}
                    <div className="w-28 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tool.lightBg} ${tool.textColor}`}>
                        <tool.icon size={12} />
                        {tool.name.replace(' 생성', '')}
                      </span>
                    </div>

                    {/* 수정일 */}
                    <div className="w-32 text-center">
                      <span className="text-sm text-gray-500">{project.updatedAt}</span>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="w-20 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 하단 통계 */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between text-sm text-gray-500 shrink-0">
        <span>총 {filteredProjects.length}개 프로젝트</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            배너 {MOCK_PROJECTS.filter(p => p.tool === 'banner').length}
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            촬영컷 {MOCK_PROJECTS.filter(p => p.tool === 'shooting').length}
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            기획서 {MOCK_PROJECTS.filter(p => p.tool === 'planning').length}
          </span>
        </div>
      </div>
    </div>
  );

  // 도구 워크스페이스 렌더링
  const renderToolWorkspace = () => {
    const tool = TOOLS[currentTool];
    if (!tool) return null;

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 도구 헤더 */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavigation('landing')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div className={`w-8 h-8 bg-gradient-to-br ${tool.bgGradient} rounded-lg flex items-center justify-center`}>
              <tool.icon size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-gray-800">{tool.name}</h1>
                {hasUnsavedChanges && (
                  <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">저장 안됨</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{tool.fullDescription}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setHasUnsavedChanges(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Save size={16} />
              저장
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              disabled={variations.length === 0}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg transition-colors ${
                variations.length > 0 
                  ? `bg-gradient-to-r ${tool.bgGradient} text-white hover:shadow-lg` 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download size={16} />
              이미지 저장
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* 좌측 패널 - 입력 */}
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 업로드 섹션 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Upload size={14} />
                  {currentTool === 'planning' ? '팀 선택' : '상품 이미지'}
                </h3>
                
                {currentTool === 'planning' ? (
                  <div className="space-y-4">
                    {/* 팀 선택 드롭다운 */}
                    <div>
                      <select 
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                      >
                        <option value="">팀을 선택하세요</option>
                        <option value="가공">가공</option>
                        <option value="뷰티">뷰티</option>
                        <option value="축산">축산</option>
                      </select>
                    </div>

                    {/* 엑셀 파일 업로드 */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileSpreadsheet size={14} />
                        제안서 엑셀 파일
                      </h4>
                      {!uploadedExcelFile ? (
                        <div
                          onClick={() => setUploadedExcelFile({ name: '3분기_제안서.xlsx', size: '2.4MB' })}
                          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                        >
                          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-600">파일을 드래그하거나 클릭</p>
                          <p className="text-xs text-gray-400 mt-1">XLS, XLSX 파일</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <FileSpreadsheet size={20} className="text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{uploadedExcelFile.name}</p>
                            <p className="text-xs text-gray-500">{uploadedExcelFile.size}</p>
                          </div>
                          <button 
                            onClick={() => setUploadedExcelFile(null)}
                            className="p-1 hover:bg-emerald-100 rounded"
                          >
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 기획서 항목 - 팀 선택 시에만 표시 */}
                    {selectedTeam && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Layers size={14} />
                          기획서 항목
                        </h4>
                        <div className="space-y-2">
                          {planningItems.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <span className="w-5 h-5 flex items-center justify-center text-xs text-gray-400 bg-gray-100 rounded">
                                {idx + 1}
                              </span>
                              {item.isDefault ? (
                                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                  {item.title}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updatePlanningItemTitle(item.id, e.target.value)}
                                  placeholder="항목 제목 입력"
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                />
                              )}
                              {!item.isDefault && (
                                <button
                                  onClick={() => removePlanningItem(item.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={addPlanningItem}
                            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1"
                          >
                            <Plus size={14} />
                            항목 추가하기
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 초안 생성하기 버튼 */}
                    <button
                      onClick={generateDraft}
                      disabled={!selectedTeam || !uploadedExcelFile || isGeneratingDraft}
                      className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                        !selectedTeam || !uploadedExcelFile || isGeneratingDraft
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {isGeneratingDraft ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          초안 생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          초안 생성하기
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={handleUpload}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all"
                    >
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-600">이미지를 드래그하거나 클릭</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG 최대 10MB</p>
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {uploadedImages.map((img, idx) => (
                          <div key={img.id} className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden group">
                            <div className="w-full h-full flex items-center justify-center">
                              <Image size={20} className="text-gray-400" />
                            </div>
                            {idx === 0 && (
                              <div className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-violet-500 text-white text-xs rounded">
                                메인
                              </div>
                            )}
                            {/* 삭제 버튼 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImages(uploadedImages.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                        <button onClick={handleUpload} className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-500">
                          <Plus size={20} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 배너용 텍스트 입력 */}
              {currentTool === 'banner' && (
                <>
                  {/* 텍스트 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">텍스트</h3>
                      {/* B 토글 버튼 */}
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (selectedTextField) {
                            setTextStyles(prev => ({
                              ...prev,
                              [selectedTextField]: prev[selectedTextField] === 'bold' ? 'regular' : 'bold'
                            }));
                          }
                        }}
                        disabled={!selectedTextField}
                        className={`w-7 h-7 rounded-md text-xs font-bold transition-all flex items-center justify-center ${
                          !selectedTextField
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : selectedTextField && textStyles[selectedTextField] === 'bold'
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        B
                      </button>
                    </div>

                    {/* 텍스트 입력 필드들 */}
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="메인 문구" 
                        onFocus={() => setSelectedTextField('headline')}
                        onBlur={(e) => {
                          if (!e.relatedTarget || !e.relatedTarget.closest('[data-style-btn]')) {
                            setSelectedTextField(null);
                          }
                        }}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all ${
                          selectedTextField === 'headline'
                            ? 'border-violet-400 bg-violet-50/50 ring-2 ring-violet-100'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${textStyles.headline === 'bold' ? 'font-bold' : 'font-normal'}`}
                      />
                      <input 
                        type="text" 
                        placeholder="메인 문구2" 
                        onFocus={() => setSelectedTextField('subheadline')}
                        onBlur={(e) => {
                          if (!e.relatedTarget || !e.relatedTarget.closest('[data-style-btn]')) {
                            setSelectedTextField(null);
                          }
                        }}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all ${
                          selectedTextField === 'subheadline'
                            ? 'border-violet-400 bg-violet-50/50 ring-2 ring-violet-100'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${textStyles.subheadline === 'bold' ? 'font-bold' : 'font-normal'}`}
                      />
                      <input 
                        type="text" 
                        placeholder="서브 문구" 
                        onFocus={() => setSelectedTextField('cta')}
                        onBlur={(e) => {
                          if (!e.relatedTarget || !e.relatedTarget.closest('[data-style-btn]')) {
                            setSelectedTextField(null);
                          }
                        }}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all ${
                          selectedTextField === 'cta'
                            ? 'border-violet-400 bg-violet-50/50 ring-2 ring-violet-100'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${textStyles.cta === 'bold' ? 'font-bold' : 'font-normal'}`}
                      />
                    </div>
                  </div>

                  {/* 작업 방식 선택 */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Layers size={14} />
                      작업 방식 선택
                    </h3>
                    
                    {/* 컴팩트 그리드 버튼 */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => toggleWorkMode('expand')}
                        className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          workModes.includes('expand')
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        배경만 확장
                      </button>
                      <button
                        onClick={() => toggleWorkMode('changeBg')}
                        className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          workModes.includes('changeBg')
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        배경 텍스쳐 변경
                      </button>
                      <button
                        onClick={() => toggleWorkMode('combine')}
                        className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          workModes.includes('combine')
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        제품 합성
                      </button>
                      <button
                        onClick={() => toggleWorkMode('custom')}
                        className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          workModes.includes('custom')
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        직접 입력
                      </button>
                    </div>

                    {/* 직접 입력 텍스트 영역 */}
                    {workModes.includes('custom') && (
                      <div className="mt-3">
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="원하는 작업 방식을 자유롭게 입력하세요. 예: 파란색 그라데이션 배경에 제품을 왼쪽에 배치해주세요"
                          className="w-full px-3 py-2.5 border-2 border-violet-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 bg-white"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 촬영컷 스타일 */}
              {currentTool === 'shooting' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">촬영 스타일</h3>
                  <textarea 
                    placeholder="원하는 촬영 스타일을 입력하세요 (예: 스튜디오 화이트, 라이프스타일, 미니멀...)"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm hover:border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all resize-none h-24"
                  />
                </div>
              )}
            </div>

            {/* 생성 버튼 - 기획서 생성 도구가 아닐 때만 표시 */}
            {currentTool !== 'planning' && (
            <div className="p-4 border-t border-gray-100">
              {/* 배너 도구일 때 툴팁 표시 */}
              {currentTool === 'banner' && uploadedImages.length > 0 && !isGenerating && workModes.length > 0 && (!workModes.includes('custom') || customPrompt.trim()) && (
                <div className="mb-3 px-3 py-2 bg-violet-50 rounded-lg">
                  <p className="text-xs text-violet-600 flex items-center gap-1.5">
                    <Lightbulb size={12} />
                    {getWorkModeTooltip()}
                  </p>
                </div>
              )}

              <button
                  onClick={handleGenerate}
                  disabled={
                    uploadedImages.length === 0 || 
                    isGenerating ||
                    (currentTool === 'banner' && workModes.length === 0) ||
                    (currentTool === 'banner' && workModes.includes('custom') && !customPrompt.trim())
                  }
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    uploadedImages.length === 0 || 
                    isGenerating ||
                    (currentTool === 'banner' && workModes.length === 0) ||
                    (currentTool === 'banner' && workModes.includes('custom') && !customPrompt.trim())
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${tool.bgGradient} text-white hover:shadow-lg`
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      {currentTool === 'banner' ? '배너 생성하기' : '생성하기'}
                    </>
                  )}
                </button>
            </div>
            )}
          </aside>

          {/* 메인 캔버스 - 기획서 생성 도구가 아닐 때만 표시 */}
          {currentTool !== 'planning' && (
          <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* 뷰 탭 */}
            {currentTool === 'banner' && variations.length > 0 && (
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center shrink-0">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  {[
                    { id: 'pc', label: 'PC', icon: Monitor },
                    { id: 'mobile', label: '모바일', icon: Smartphone },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        viewMode === tab.id ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 캔버스 영역 */}
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
              {variations.length === 0 ? (
                <div className="text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${tool.bgGradient} rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-20`}>
                    <tool.icon size={40} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    이미지를 업로드하세요
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    상품 이미지를 업로드하고 생성하기를 클릭하세요
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-4xl">
                  {currentTool === 'banner' && (
                    <div className="flex flex-col items-center">
                      {viewMode === 'pc' && (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                          <div 
                            className="w-[640px] h-[160px] flex items-center justify-between px-16 relative"
                            style={{ backgroundColor: '#c8c4bc' }}
                          >
                            {/* 텍스트 영역 */}
                            <div className="text-gray-800 z-10">
                              <h2 className={`text-2xl mb-1 ${textStyles.headline === 'bold' ? 'font-bold' : 'font-normal'}`}>국물·구이·볶음 외</h2>
                              <h2 className={`text-2xl mb-2 ${textStyles.subheadline === 'bold' ? 'font-bold' : 'font-normal'}`}>따끈한 겨울 집밥 ~37%</h2>
                              <p className="text-gray-600 text-sm">~12.01(월) 11시</p>
                            </div>
                            {/* 음식 이미지 영역 */}
                            <div className="flex items-center relative">
                              {/* 찌개 이미지 */}
                              <div className="w-32 h-32 rounded-full bg-amber-600 flex items-center justify-center shadow-xl overflow-hidden relative z-10">
                                <div className="w-28 h-28 rounded-full bg-orange-400 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="w-6 h-6 bg-yellow-200 rounded-full mx-auto mb-1"></div>
                                    <div className="flex gap-1 justify-center">
                                      <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                                      <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* 불고기 이미지 */}
                              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-xl overflow-hidden -ml-4 -mt-16 relative z-20">
                                <div className="w-20 h-20 rounded-full bg-stone-600 flex items-center justify-center">
                                  <div className="w-12 h-8 bg-stone-500 rounded"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {viewMode === 'mobile' && (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                          <div 
                            className="w-[200px] h-[300px] p-4 flex flex-col items-center justify-center text-center"
                            style={{ backgroundColor: '#c8c4bc' }}
                          >
                            <div className="flex items-center mb-4 relative">
                              <div className="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center shadow-xl overflow-hidden z-10">
                                <div className="w-16 h-16 rounded-full bg-orange-400"></div>
                              </div>
                              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-xl -ml-3 -mt-8 z-20">
                                <div className="w-10 h-10 rounded-full bg-stone-600"></div>
                              </div>
                            </div>
                            <h2 className={`text-sm text-gray-800 mb-1 ${textStyles.headline === 'bold' ? 'font-bold' : 'font-normal'}`}>국물·구이·볶음 외</h2>
                            <h2 className={`text-base text-gray-800 mb-1 ${textStyles.subheadline === 'bold' ? 'font-bold' : 'font-normal'}`}>따끈한 겨울 집밥</h2>
                            <p className="text-gray-800 text-lg font-bold mb-2">~37%</p>
                            <p className="text-gray-600 text-xs">~12.01(월) 11시</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {currentTool === 'shooting' && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto">
                      <div className={`aspect-square bg-gradient-to-br ${tool.bgGradient} p-8 flex items-center justify-center`}>
                        <div className="w-48 h-48 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Camera size={48} className="text-white/60" />
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-400 flex justify-between items-center">
                        <span>상품 촬영컷</span>
                        <span>2048 × 2048</span>
                      </div>
                    </div>
                  )}

                  </div>
              )}
            </div>

            </main>
          )}

          {/* 우측 패널 */}
          {currentTool === 'planning' ? (
            /* 기획서 생성 - 초안 편집 패널 (화면 꽉 채움) */
            <aside className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {!isDraftGenerated ? (
                  <div className="text-center py-20 text-gray-400">
                    <FileSpreadsheet size={64} className="mx-auto mb-6 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">초안을 생성하세요</h3>
                    <p className="text-sm mb-1">좌측에서 팀을 선택하고 엑셀 파일을 업로드한 후</p>
                    <p className="text-sm">"초안 생성하기" 버튼을 클릭하세요</p>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                      <Check size={16} className="text-emerald-600" />
                      <span className="text-sm text-emerald-700 font-medium">AI 초안이 생성되었습니다. 내용을 수정할 수 있습니다.</span>
                    </div>
                    
                    {/* 동적 필드 렌더링 */}
                    {planningItems.filter(item => item.title).map((item, idx) => (
                      <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <Tag size={14} className="text-emerald-500" />
                          {item.title}
                        </label>
                        <p className="text-xs text-gray-400 mb-2">필수사항: 현장감 있는 피드백 반영해주세요.</p>
                        {idx < 2 ? (
                          <input 
                            type="text" 
                            value={draftValues[item.id] || ''}
                            onChange={(e) => updateDraftValue(item.id, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                          />
                        ) : (
                          <textarea 
                            value={draftValues[item.id] || ''}
                            onChange={(e) => updateDraftValue(item.id, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm h-32 resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 컨플루언스 버튼 영역 */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="max-w-3xl mx-auto flex gap-3">
                  {confluenceResult.isGenerated ? (
                    <>
                      <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <Check size={18} className="text-emerald-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-emerald-700">컨플루언스 문서가 생성되었습니다</p>
                          <p className="text-xs text-emerald-600 truncate">{confluenceResult.url}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(confluenceResult.url)}
                        className="px-4 py-3 text-sm font-medium text-emerald-700 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <Copy size={16} />
                        링크 복사
                      </button>
                      <button 
                        onClick={() => window.open(confluenceResult.url, '_blank')}
                        className="px-6 py-3 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        문서 열기
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setConfluenceResult({ ...confluenceResult, isGenerating: true });
                        setTimeout(() => {
                          setConfluenceResult({
                            isGenerated: true,
                            url: 'https://confluence.company.com/display/MKT/3분기-프리미엄-견과류-기획서',
                            isGenerating: false
                          });
                        }, 2000);
                      }}
                      disabled={!isDraftGenerated || confluenceResult.isGenerating}
                      className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        !isDraftGenerated || confluenceResult.isGenerating
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {confluenceResult.isGenerating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          문서 생성 중...
                        </>
                      ) : (
                        <>
                          <FileText size={18} />
                          컨플루언스로 만들기
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </aside>
          ) : (
            /* 기본 - AI 변형 패널 */
            <aside className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles size={14} className={`text-${tool.color}-500`} />
                AI 변형
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {variations.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Layers size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">생성하면 변형이 표시됩니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {variations.map((v, idx) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariation(idx)}
                      className={`rounded-xl cursor-pointer transition-all overflow-hidden ${
                        selectedVariation === idx 
                          ? 'ring-2 ring-violet-500' 
                          : 'hover:opacity-80'
                      }`}
                    >
                      <div 
                        className="h-14 px-3 flex items-center justify-between"
                        style={{ backgroundColor: '#c8c4bc' }}
                      >
                        <div className="text-gray-800">
                          <p className="text-xs font-bold">따끈한 겨울 집밥</p>
                          <p className="text-xs">~37%</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-600 shadow-md z-10"></div>
                          <div className="w-6 h-6 rounded-full bg-gray-100 shadow-md -ml-2 z-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 히스토리 */}
            <div className="p-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock size={14} />
                편집 기록
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {editHistory.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">기록이 없습니다</p>
                ) : (
                  editHistory.slice().reverse().map((h, i) => (
                    <div key={i} className="text-xs p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">{h.date} {h.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={10} className="text-violet-500 shrink-0" />
                        <span className="text-gray-700 font-medium">{h.message}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Creative AI - AI 기반 마케팅 콘텐츠 생성 도구</title>
        <meta name="description" content="배너, 촬영컷, 기획서를 AI로 자동 생성하세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen flex bg-gray-100 overflow-hidden">
        {/* 글로벌 사이드바 */}
        {renderSidebar()}

        {/* 메인 콘텐츠 */}
        {currentView === 'landing' && renderLanding()}
        {currentView === 'tool' && renderToolWorkspace()}

        {/* 저장 확인 모달 */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Save size={24} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">작업을 저장할까요?</h3>
              <p className="text-sm text-gray-500 mt-1">저장하지 않은 변경사항이 있습니다.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (pendingNavigation) executeNavigation(pendingNavigation.destination, pendingNavigation.tool);
                }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
              >
                저장 안함
              </button>
              <button
                onClick={handleSaveAndNavigate}
                className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700"
              >
                저장 후 이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 생성 진행 모달 */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className={`w-16 h-16 bg-gradient-to-br ${TOOLS[currentTool]?.bgGradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">생성 중...</h3>
            <p className="text-sm text-gray-500 mb-4">{getProgressLabel()}</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div
                className={`bg-gradient-to-r ${TOOLS[currentTool]?.bgGradient} h-2 rounded-full transition-all`}
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 도구 간 연동 모달 */}
      {showCrossToolModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">다른 도구에서 사용하기</h3>
              <button onClick={() => setShowCrossToolModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {Object.values(TOOLS).filter(t => t.id !== currentTool).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setShowCrossToolModal(false);
                    setCurrentTool(tool.id);
                  }}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${tool.bgGradient} rounded-lg flex items-center justify-center`}>
                    <tool.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tool.name}</p>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 내보내기 모달 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">이미지 저장</h3>
              <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {currentTool === 'banner' && (
                <>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-violet-600 rounded" />
                    <Monitor size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">PC 배너</p>
                      <p className="text-xs text-gray-400">1920 × 600 px</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-violet-600 rounded" />
                    <Smartphone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">모바일 배너</p>
                      <p className="text-xs text-gray-400">720 × 1080 px</p>
                    </div>
                  </label>
                </>
              )}
              {currentTool === 'shooting' && (
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded" />
                  <Camera size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">상품 촬영 이미지</p>
                    <p className="text-xs text-gray-400">2048 × 2048 px</p>
                  </div>
                </label>
              )}
              {currentTool === 'planning' && (
                <>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">PDF 문서</p>
                      <p className="text-xs text-gray-400">인쇄용 포맷</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Word 문서</p>
                      <p className="text-xs text-gray-400">편집 가능한 .docx</p>
                    </div>
                  </label>
                </>
              )}
              <button className={`w-full py-3 bg-gradient-to-r ${TOOLS[currentTool]?.bgGradient} text-white rounded-xl font-semibold flex items-center justify-center gap-2`}>
                <Download size={18} />
                다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 자동 저장 인디케이터 */}
      {hasUnsavedChanges && currentView === 'tool' && (
        <div className="fixed bottom-4 right-4 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          자동 저장 중...
        </div>
      )}
    </div>
    </>
  );
}
