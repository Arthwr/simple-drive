import multer from 'multer';

const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    files: 3,
  },
});

const uploadFilesMiddleware = upload.array('uploaded_files', 3);

export default uploadFilesMiddleware;
