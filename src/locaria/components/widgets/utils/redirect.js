import React from 'react';

export default function Redirect({location}) {
    window.location=location;
    return (<h1> Redirecting {location}</h1>)
}