import earthImage from '../../assets/hero/global-study-earth.png'

export default function RealisticEarth() {
  return (
    <div className="earth realistic-earth" aria-hidden="true">
      <img src={earthImage} alt="" width="1254" height="1254" fetchPriority="high" />
      <span className="earth-cloud-light" />
      <span className="earth-shine" />
    </div>
  )
}
