import { fetchCatalogs } from './fetch-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src/data/catalogs.json')
const now = new Date()
const date = new Date()

console.log(
	`Catalogs fetched at ${date.toLocaleString('en-US', {
		timeZone: 'America/Argentina/Buenos_Aires',
	})}`
)

if (fs.existsSync(filePath)) {
	console.log('Catalogs file exists. Fetching catalogs...')
	fetchCatalogs()

	cron.schedule('00 11 * * *', () => {
		console.log('Scheduled job: Fetching catalogs...')
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
		})
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file created. Fetching catalogs...')
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
			cron.schedule('00 11 * * *', () => {
				console.log('Scheduled job: Fetching catalogs...')
				fetchCatalogs().then(() => {
					console.log('Catalogs file updated.')
				})
			})
		})
	})
}

module.exports = (req, res) => {
	res.status(200).send('Cron job scheduled')
}