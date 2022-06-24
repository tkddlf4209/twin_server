import React from 'react'
import './widgetSm.css'
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function WidgetSm(){
    return (
    <div className='widgetSm'>
      <span className='widgetSmTitle'>New Join Memeber</span>
      <ul className='widgetSmList'>
          <li className='widgetSmListItem'>
              <img alt="" className='widgetSmImg' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
              <div className='widgetSmUser'>
                  <span className='widgetSmUsername'>Sangil IM</span>
                  <span className='widgetSmUserTitle'>Software Engineer</span>
              </div>
              <button className='widgetSmButton'>
                <VisibilityIcon className='widgetSmIcon'/>
                Display
              </button>
          </li>
          <li className='widgetSmListItem'>
              <img alt="" className='widgetSmImg' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
              <div className='widgetSmUser'>
                  <span className='widgetSmUsername'>Sangil IM</span>
                  <span className='widgetSmUserTitle'>Software Engineer</span>
              </div>
              <button className='widgetSmButton'>
                <VisibilityIcon className='widgetSmIcon'/>
                Display
              </button>
          </li>
          <li className='widgetSmListItem'>
              <img alt="" className='widgetSmImg' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
              <div className='widgetSmUser'>
                  <span className='widgetSmUsername'>Sangil IM</span>
                  <span className='widgetSmUserTitle'>Software Engineer</span>
              </div>
              <button className='widgetSmButton'>
                <VisibilityIcon className='widgetSmIcon'/>
                Display
              </button>
          </li>
      </ul>
    </div>
    )
}