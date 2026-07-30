import { Component, type ErrorInfo, type ReactNode } from 'react'
import EnglishTestShell from '../EnglishTestShell'

type Props={children:ReactNode}
type State={hasError:boolean}

export default class EnglishTestErrorBoundary extends Component<Props,State>{
  state:State={hasError:false}

  static getDerivedStateFromError():State{
    return {hasError:true}
  }

  componentDidCatch(error:Error,info:ErrorInfo){
    console.error('English test render failed',{
      message:error.message,
      componentStack:info.componentStack,
    })
  }

  render(){
    if(this.state.hasError){
      return <EnglishTestShell><div className="test-loading"><p className="test-error">حدث خطأ أثناء عرض الاختبار.</p><button className="btn primary" onClick={()=>window.location.reload()}>إعادة تحميل الاختبار</button></div></EnglishTestShell>
    }
    return this.props.children
  }
}
