import indiaImage from '../assets/study-destinations/india.png'
import malaysiaImage from '../assets/study-destinations/malaysia.png'
import chinaImage from '../assets/study-destinations/china.png'
import russiaImage from '../assets/study-destinations/russia.png'
import turkeyImage from '../assets/study-destinations/turkey.png'
import type { StudyDestination } from '../types/studyDestination'

const message = (country: string) =>
  `مرحبًا أستاذ علي، أرغب في معرفة تفاصيل الدراسة والتسجيل في ${country}.`

export const studyDestinations: StudyDestination[] = [
  {
    id: 'india',
    nameAr: 'الهند',
    descriptionAr: 'وجهة تعليمية متنوعة تضم جامعات وكليات عديدة، مع خيارات واسعة في التقنية والهندسة والإدارة والعلوم الصحية.',
    imageUrl: indiaImage,
    imageAltAr: 'الدراسة في الهند',
    highlightsAr: ['تنوع كبير في الجامعات والتخصصات', 'برامج دراسية باللغة الإنجليزية', 'خيارات مناسبة لميزانيات مختلفة', 'مدن طلابية معروفة مثل بنغالور'],
    whatsappMessageAr: message('الهند'),
  },
  {
    id: 'malaysia',
    nameAr: 'ماليزيا',
    descriptionAr: 'بيئة دراسية حديثة ومتعددة الثقافات، وتضم جامعات دولية وبرامج أكاديمية مناسبة للطلاب من مختلف الدول.',
    imageUrl: malaysiaImage,
    imageAltAr: 'الدراسة في ماليزيا',
    highlightsAr: ['جامعات ذات بيئة دولية', 'برامج باللغة الإنجليزية', 'حياة طلابية مريحة', 'خيارات متنوعة في الأعمال والتقنية'],
    whatsappMessageAr: message('ماليزيا'),
  },
  {
    id: 'china',
    nameAr: 'الصين',
    descriptionAr: 'وجهة تعليمية متقدمة في مجالات الهندسة والتكنولوجيا والعلوم، مع جامعات كبيرة وفرص أكاديمية متنوعة.',
    imageUrl: chinaImage,
    imageAltAr: 'الدراسة في الصين',
    highlightsAr: ['قوة في الهندسة والتكنولوجيا', 'جامعات ومختبرات متقدمة', 'برامج دولية متعددة', 'تجربة ثقافية وتعليمية مميزة'],
    whatsappMessageAr: message('الصين'),
  },
  {
    id: 'russia',
    nameAr: 'روسيا',
    descriptionAr: 'تشتهر ببرامج الطب والهندسة والعلوم، وتقدم خيارات دراسية متنوعة للطلاب الدوليين في عدد من المدن الجامعية.',
    imageUrl: russiaImage,
    imageAltAr: 'الدراسة في روسيا',
    highlightsAr: ['برامج معروفة في الطب والهندسة', 'جامعات تستقبل طلابًا دوليين', 'خيارات أكاديمية متعددة', 'دعم في خطوات التقديم والقبول'],
    whatsappMessageAr: message('روسيا'),
  },
  {
    id: 'turkey',
    nameAr: 'تركيا',
    descriptionAr: 'تجمع بين التعليم الحديث والبيئة الثقافية القريبة، وتوفر جامعات حكومية وخاصة وبرامج دراسية متعددة.',
    imageUrl: turkeyImage,
    imageAltAr: 'الدراسة في تركيا',
    highlightsAr: ['جامعات حكومية وخاصة', 'برامج باللغة التركية والإنجليزية', 'بيئة مناسبة للطلاب الدوليين', 'موقع وثقافة جذابة للطلاب'],
    whatsappMessageAr: message('تركيا'),
  },
]
