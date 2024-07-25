import React from 'react'

function Header() {
    return (
        <header style={{
            backgroundColor: 'rgba(246, 219, 170, 0.675)',
            gridArea: 'header',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px',
            boxShadow: '0 6px 7px -3px rgba(0, 0, 0, 0.35)',
            width: '84vw',
        }}>
        <h9 style={{
            color: 'black'
        }}> Welcome, Admin.</h9>
        </header>
        
            
        
    )
}
export default Header