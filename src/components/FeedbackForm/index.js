import React from 'react';
import Iframe from 'react-iframe'

const FeedbackForm = () =>
<Iframe url="https://www.surveymonkey.com/r/datanexus"
        width="450px"
        height="450px"
        className="feedback-survey"
        display="initial"
        position="relative"
        loading="auto"/>

export default FeedbackForm;