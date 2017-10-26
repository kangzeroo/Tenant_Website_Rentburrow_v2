// AWS S3 (Simple Scalable Storage) for storing files on the cloud
import Rx from 'rxjs'
import AWS from 'aws-sdk/global'
import AWS_S3 from 'aws-sdk/clients/s3'
import { BUCKET_NAME, ENCRYPTED_BUCKET_NAME } from './aws-profile'


export const createUserS3Album = ({ corp_id }) => {
	const p = new Promise((res, rej) => {
		const albumName = corp_id
	  AWS.config.credentials.refresh(() => {
			const S3 = new AWS_S3()
			if (!albumName) {
				const msg = 'Album names must contain at least one non-space character.'
	    	// console.log(msg);
	    	rej(msg)
	    	return
	  	}
			if (albumName.indexOf('/') !== -1) {
				const msg = 'Album names cannot contain slashes.'
		    // console.log(msg);
		    rej(msg)
		    return
			}
	  	const albumKey = `${albumName}/`
	  	const params = {
	  		Bucket: BUCKET_NAME,
	  		Key: albumKey
	  	}
	  	S3.headObject(params, (err, data) => {
		    if (!err) {
		    	const msg = 'Album already exists.'
		    	// console.log(msg);
	      	res(albumKey)
	      	return
		    }
		    if (err.code !== 'NotFound') {
		    	const msg = `There was an error creating your album: ${err.message}`
		    	// console.log(msg);
	      	rej(msg)
	      	return
		    }
				if (err) {
			    const albumParams = {
			    	...params,
			    	ACL: 'bucket-owner-full-control',
			    	StorageClass: 'STANDARD'
			    }
			    S3.putObject(albumParams, (err, data) => {
		      	if (err) {
							// console.log(err)
		      		const msg = `There was an error creating your album: ${err.message}`
		      		// console.log(msg);
		        	rej(msg)
		        	return
		      	}
		      	// console.log('Successfully created album.')
		      	res(albumKey)
			    })
				}
	  	})
		})
	})
	return p
}

// filter out any files that are not .png or .jpg/.jpeg
export function filterNonImages(acceptedFiles){
	// console.log(acceptedFiles)
	const filteredFiles = acceptedFiles.filter((file)=>{
		const parts = file.name.split('.')
		const extension = parts[parts.length-1].toLowerCase()
		if(extension == "jpg" || extension == "jpeg" || extension == "png"){
			return true
		}else{
			return false
		}
	})
	// console.log(filteredFiles)
	return filteredFiles
}

// observables style batch image upload
export const uploadBatchImagesRx = (images, s3_corporation, prefix) => {
	const p = new Promise((res, rej) => {
		AWS.config.credentials.refresh(() => {
			const obs = Rx.Observable.create((observer) => {
				const promiseArray = images.map((img) => {
					return uploadImageToS3(img, s3_corporation, prefix).then((s3_img) => {
						observer.next(s3_img)
					})
				})
				Promise.all(promiseArray).then(() => {
					observer.complete()
				}).catch((err) => {
					observer.error()
				})
			})
			res(obs)
		})
	})
	return p
}

// S3 upload function
// the prefixes are very important for S3 folder structure
// we group S3 assets from folders such as so:
// corporation > building > main_photos > img.png
// corporation > corporation_assets > thumbnail > img.png
export const uploadImageToS3 = (image, s3_corporation, prefix) => {
	const p = new Promise((res, rej) => {
		const S3 = new AWS_S3()
		const fileName = `${image.name}`;
		const timestamp = new Date().getTime()/1000

		// S3 Folder-File syntax: corp_id/building_id/asset_type/file_name.png
		const imageKey = s3_corporation + prefix + fileName
		S3.upload({
				Bucket: BUCKET_NAME,
		    Key: imageKey,
		    Body: image,
		    ACL: 'public-read'
		}, (err, S3Object) => {
		    if (err) {
		      	const msg = `There was an error uploading your photo: ${err.message}`
		      	// console.log(msg)
		      	rej(msg)
		      	return
		    }
				const msg = `Successfully uploaded original photo ${fileName}`
				res(S3Object)
		})
	})
	return p
}


// S3 upload function
// the prefixes are very important for S3 folder structure
// we group S3 assets from folders such as so:
// corporation > building > main_photos > img.png
// corporation > corporation_assets > thumbnail > img.png
export const uploadImageToS3WithEncryption = (image, s3_corporation, prefix) => {
	const p = new Promise((res, rej) => {
		const S3 = new AWS_S3()
		const fileName = `${image.name}`;
		const timestamp = new Date().getTime()/1000

		// S3 Folder-File syntax: corp_id/building_id/asset_type/file_name.png
		const imageKey = s3_corporation + prefix + fileName
		AWS.config.credentials.refresh(() => {
			S3.upload({
					Bucket: ENCRYPTED_BUCKET_NAME,
			    Key: imageKey,
			    Body: image,
			    ACL: 'authenticated-read',
					ServerSideEncryption: 'AES256',
			}, (err, S3Object) => {
			    if (err) {
			      	const msg = `There was an error uploading your photo: ${err.message}`
			      	// console.log(msg)
			      	rej(msg)
			      	return
			    }
					const msg = `Successfully uploaded original photo ${fileName}`
					res(S3Object)
			})
		})
	})
	return p
}

export const getEncryptedS3Image = (url, cognito_user_id) => {
	const p = new Promise((res, rej) => {
		const S3 = new AWS_S3()
		// https://rentburrow3-tenant-images.s3.amazonaws.com/8f24fead-afa4-4598-9e3b-90a4d1809bde/student_card-181575fb8a8651eea950686533241f0a.jpeg
		const imageKeyLoc = url.indexOf(cognito_user_id)
		const imageKey = url.slice(imageKeyLoc + cognito_user_id.length + 1)
		// console.log(imageKey)
		AWS.config.credentials.refresh(() => {
			S3.getObject({
					Bucket: ENCRYPTED_BUCKET_NAME,
			    Key: imageKey,
			}, (err, S3Object) => {
			    if (err) {
			      	const msg = `There was an error reading your photo: ${err.message}`
			      	// console.log(msg)
			      	rej(msg)
			      	return
			    }
					const msg = `Successfully got original photo ${imageKey}`
					res(S3Object)
			})
		})
	})
	return p
}


// export const uploadPDFToS3 = (file, resdata, prefix) => {
// 	const p = new Promise((res, rej) => {
// 		const S3 = new AWS_S3()
// 		const fileName = `${file.name}`;
// 		// const timestamp = new Date().getTime()/1000
//
// 		// S3 Folder-File syntax: corp_id/building_id/asset_type/file_name.png
// 	//	const imageKey = s3_corporation + prefix + fileName
// 		const doc = new PDFDocument(resdata)
// 		console.log(doc)
// 		// doc.text(resdata)
// 		doc.end()
// 		S3.upload({
// 				Bucket: 'lease-agreements-completed',
// 		    Key: 'application_contract.pdf',
// 		    Body: doc,
// 				contentType: 'application/pdf',
// 		    ACL: 'public-read'
// 		}, (err, S3Object) => {
// 		    if (err) {
// 		      	const msg = `There was an error uploading your photo: ${err.message}`
// 		      	// console.log(msg)
// 		      	rej(msg)
// 		      	return
// 		    }
// 				const msg = `Successfully uploaded original photo ${fileName}`
// 				res(S3Object)
// 		})
// 	})
// 	return p
// }
