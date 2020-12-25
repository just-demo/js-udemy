const request = require('sync-request');
const path = require('path');

const courseId = getCourseId();
const dates = [];
let total = null;
let url = `https://www.udemy.com/api-2.0/courses/${courseId}/reviews/?page=1`;
while (url) {
    let progress = total ? Math.round(100 * dates.length / total) : 0;
    console.log(url, `${progress}%`);
    let reviews = JSON.parse(request('GET', url).getBody('utf8'));
    dates.push(...reviews.results.map(result => result.created));
    total = reviews.count;
    url = reviews.next;
}

dates.sort();

console.log('Course id:', courseId);
console.log('Number of reviews:', dates.length);
console.log('First review date:', dates[0]);
console.log('Last review date:', dates[dates.length - 1]);

function getCourseId() {
    if (process.argv.length < 3) {
        console.log('Please provide path to course with a program argument:');
        console.log(`node ${path.basename(__filename)} <cource-url|course-literal-id|course-numeric-id>`);
        process.exit(1);
    }

    let courseId = process.argv[2];
    if (/^\d+$/.test(courseId)) {
        return courseId;
    }

    let courseUrl = courseId.includes('/course/') ? courseId :
        'https://www.udemy.com/course/' + courseId.replace(/^\/+|\/+$/g, '');

    let courseHtml;
    try {
        courseHtml = request('GET', courseUrl).getBody('utf8');
    } catch (error) {
        console.log('Error reading page:', courseUrl);
        process.exit(1);
    }

    let match = /data-clp-course-id="(\d+)"/.exec(courseHtml);
    if (!match) {
        console.log('Error fetching course id from page:', courseUrl);
        process.exit(1);
    }

    return match[1];
}