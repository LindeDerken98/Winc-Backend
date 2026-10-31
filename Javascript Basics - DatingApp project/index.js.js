'use strict';

const mockData = require('./mockData.js').data;
const prompt = require('prompt-sync')();

console.log(mockData);

const profile = {};

while (true) {
	const firstName = prompt('What is your first name? ');
	if (firstName === '') {
		console.log('First name cannot be empty. Please try again.');
	} else {
		profile.first_name = firstName;
		break;
	}
}

while (true) {
	const lastName = prompt('What is your last name? ');
	if (lastName === '') {
		console.log('Last name cannot be empty. Please try again.');
	} else {
		profile.last_name = lastName;
		break;
	}
}

function promptForMinimumAge(question) {
	while (true) {
		const age = Number(prompt(question));
		if (!Number.isFinite(age) || age < 18) {
			console.log('Please enter a number that is 18 or higher.');
		} else {
			return age;
		}
	}
}

profile.age = promptForMinimumAge('What is your age? ');

while (true) {
	const gender = prompt('What is your gender (M, F, B or X)? ').toUpperCase();
	if (!['M', 'F', 'X', 'B'].includes(gender)) {
		console.log('Please enter M, F, B or X.');
	} else {
		profile.gender = gender;
		break;
	}
}

while (true) {
	const genderPreference = prompt('Which gender are you interested in (M, F, B or X)? ').toUpperCase();
	if (!['M', 'F', 'X', 'B'].includes(genderPreference)) {
		console.log('Please enter M, F, B or X.');
	} else {
		profile.gender_preference = genderPreference;
		break;
	}
}

while (true) {
	const location = prompt('Do you live in a rural area or a city? ').toLowerCase();
	if (!['rural', 'city'].includes(location)) {
		console.log('Please enter rural or city.');
	} else {
		profile.location = location;
		break;
	}
}

profile.min_age_interest = promptForMinimumAge(
	'What is the minimum age you are interested in? '
);

while (true) {
	const maxAgeInterest = Number(prompt('What is the maximum age you are interested in? '));
	if (!Number.isFinite(maxAgeInterest) || maxAgeInterest < 18) {
		console.log('Please enter a number that is 18 or higher.');
	} else if (maxAgeInterest <= profile.min_age_interest) {
		console.log('Maximum interested age must be higher than minimum interested age.');
	} else {
		profile.max_age_interest = maxAgeInterest;
		break;
	}
}

console.log('Your profile:', profile);

const matches = [];
let matchCount = 0;

for (const candidate of mockData) {
	const ageMatches =
		candidate.age >= profile.min_age_interest &&
		candidate.age <= profile.max_age_interest;
	const myAgeMatchesTheirInterest =
		profile.age >= candidate.min_age_interest &&
		profile.age <= candidate.max_age_interest;
	const theirGenderInterestMatches =
		candidate.gender_preference === profile.gender ||
		(candidate.gender_preference === 'B' && ['M', 'F'].includes(profile.gender));
	const myGenderInterestMatches = profile.gender_preference === candidate.gender;
	const locationMatches = candidate.location === profile.location;

	if (
		ageMatches &&
		myAgeMatchesTheirInterest &&
		theirGenderInterestMatches &&
		myGenderInterestMatches &&
		locationMatches
	) {
		matches.push(candidate);
		matchCount += 1;
	}
}

console.log('Your matches:');
if (matches.length === 0) {
	console.log('No matches found.');
} else {
	for (const match of matches) {
		console.log(
			`${match.first_name} ${match.last_name}, age ${match.age}, location: ${match.location}`
		);
	}
}
console.log(`Number of matches: ${matchCount}`);

// How i used AI: It helped me clean up my code, make it more readable amd reusable by adding the functions.
// I also used it to help me with the logic of the matching algorithm.
// When i was done writing the code, i asked it to review my code and give me feedback on how to improve it.