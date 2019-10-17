import React from 'react';
import Iframe from 'react-iframe'

const FeedbackForm = () =>
<Iframe url="https://www.surveymonkey.com/r/datanexus"
        width="100%"
        height="500px"
        className="feedback-survey"
        display="initial"
        position="relative"
        loading="auto"/>

export default FeedbackForm;