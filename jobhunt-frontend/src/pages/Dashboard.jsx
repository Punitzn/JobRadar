import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Companies from './tabs/Companies'
import Heatmap from './tabs/Heatmap'
import Report from './tabs/Report'
import Resume from './tabs/Resume'
import Settings from './tabs/Settings'
import './Dashboard.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('companies')

  const renderTab = () => {
    switch (activeTab) {
      case 'companies':
        return <Companies />
      case 'heatmap':
        return <Heatmap />
      case 'report':
        return <Report />
      case 'resume':
        return <Resume />
      case 'settings':
        return <Settings />
      default:
        return <Companies />
    }
  }

  return (
    <div className="dashboard" id="dashboard-page">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="dashboard-content">
        {renderTab()}
      </main>
    </div>
  )
}
