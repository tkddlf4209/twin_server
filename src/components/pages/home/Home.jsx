import React from 'react'
import './home.css'
import Info from '../../contents/Info'
import WidgetSm from '../../../components/WidgetSm/WidgetSm'
import WidgetLg from '../../../components/WidgetLg/WidgetLg'
export default function home(){
    return (
    <div className='home'>
        <Info/>
        <div className='homeWidgets'>
            <WidgetSm/>
            <WidgetLg/>
        </div>
    </div>
    )
}