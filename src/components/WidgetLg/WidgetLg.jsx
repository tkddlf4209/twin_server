import React from 'react'
import './widgetLg.scss'

export default function WidgetLg(){

    const Button = ({type}) =>{
      return <button className ={'widgetLgButton  '+ type}>{type}</button>
    }

    return (
    <div className='widgetLg'>
      <h3 className='widgetLgTitle'>Latest transactions</h3>
      <table className='widgetLgTable'>
        <tr className='widgetLgtr'>
          <th className='widgetLgTh'>Customer</th>
          <th className='widgetLgTh'>Date</th>
          <th className='widgetLgTh'>Amount</th>
          <th className='widgetLgTh'>Status</th>
        </tr>
        <tr className='widgetLgTr'>
          <td className='widgetLgUser'>
            <img className='widgetLgImg' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
            <span className='widgetLgName'>Sangil Im</span>
            
          </td>
          <td className='widgetLgDate'>2022.06.08</td>
          <td className='widgetLgAmount'>$112.00</td>
          <td className='widgetLgStatus'>
            <Button type="Approved"/>
          </td>
        </tr>
        <tr className='widgetLgTr'>
          <td className='widgetLgUser'>
          <img className='widgetLgImg' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
             <span className='widgetLgName'>Sangil Im</span>
            
          </td>
          <td className='widgetLgDate'>2022.06.08</td>
          <td className='widgetLgAmount'>$112.00</td>
          <td className='widgetLgStatus'>
            <Button type="Declined"/>
          </td>
        </tr>
        <tr className='widgetLgTr'>
          <td className='widgetLgUser'>
          <img className='widgetLgImg' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
            <span className='widgetLgName'>Sangil Im</span>
            
          </td>
          <td className='widgetLgDate'>2022.06.08</td>
          <td className='widgetLgAmount'>$112.00</td>
          <td className='widgetLgStatus'>
            <Button type="Panding"/>
          </td>
        </tr>
      </table>
    </div>
    )
}