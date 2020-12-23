const request = require('sync-request');

const course = process.argv[2];

const dates = [];
let total = null;
let url = `https://www.udemy.com/api-2.0/courses/${course}/reviews/?page=1`;
while (url) {
    let progress = total ? Math.round(100 * dates.length / total) : 0;
    console.log(url, `${progress}%`);
    let reviews = JSON.parse(request('GET', url).getBody('utf8'));
    dates.push(...reviews.results.map(result => result.created));
    total = reviews.count;
    url = reviews.next;
}

dates.sort();

console.log('Number of reviews:', dates.length);
console.log('First review date:', dates[0]);
console.log('Last review date:', dates[dates.length - 1]);