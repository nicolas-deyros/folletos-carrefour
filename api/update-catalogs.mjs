import fs from 'fs'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
const DATA_DIR = '/tmp'
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

export const fetchCatalogs = async () => {
	try {
		console.log('Fetching catalogs...')
		let shouldFetch = true
		if (fs.existsSync(DATA_FILE)) {
			const stats = fs.statSync(DATA_FILE)
			const hoursSinceLastFetch = (new Date() - stats.mtime) / 1000 / 60 / 60
			if (hoursSinceLastFetch < 24) {
				console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
				shouldFetch = false
			}
		}
		if (shouldFetch) {
			const res = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
			const data = await res.json()

			if (!fs.existsSync(DATA_DIR)) {
				fs.mkdirSync(DATA_DIR, { recursive: true })
			}

			await writeFile(DATA_FILE, JSON.stringify(data))
			console.log(`Catalogs file saved at ${DATA_FILE}`)
		}
	} catch (e) {
		console.error(e)
	}
}