import React from 'react';

export const MobileEventRow = ({ className, cellClassName, event, isActive, onClick }) => (
  <div className={`${className} MobileRow ${isActive ? 'MobileRow--active' : ''}`}>
    <div className={`${cellClassName} MobileCell--header`} onClick={onClick}>
      <span><a href={event.url} target="_blank">{event.name}</a> - {event.date}</span>
      {isActive && <div className="Arrow Arrow--up"></div>}
      {!isActive && <div className="Arrow Arrow--down"></div>}
    </div>
    <div className={`${cellClassName} MobileCell--body`}>
      {event.city}, {event.country} <br />
      <a href={event.cfpUrl} target="_blank">CFP Closes on {event.cfpClose}</a>
      <div className='u-small'>{event.eventTags}</div>
    </div>
  </div>
);