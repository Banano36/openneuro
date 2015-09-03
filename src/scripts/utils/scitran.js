import request from './request';
import async   from 'async';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

// User Management ------------------------------------------------------------------------

    /**
     * Get Users
     *
     * Gets a list of all users
     */
    getUsers (callback) {
        request.get('users', {}, callback);
    },
    
    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get('users/self', {}, callback);
    },

    /**
     * Add User
     *
     * Takes an email, first name, and last name
     * add adds the user.
     */
    addUser (userData, callback) {
        let self = this;
        request.post('users', {body: userData}, (err, res) => {
            self.createGroup(userData._id, userData._id, callback);
        });
    },

    /**
     * Remove User
     *
     * Takes a userId and removes the user.
     */
     removeUser (userId, callback) {
        request.del('users/' + userId, (err, res) => {
            request.del('groups/' + userId, (err, res) => {
                callback(err, res);
            });
        });
     },

// Create ---------------------------------------------------------------------------------

    /**
     * Create Group
     *
     * Takes a groupName and a userId and
     * creates a group with that user as the
     * admin.
     */
    createGroup (groupName, userId, callback) {
        let body = {
            _id: groupName,
            roles: [{access: 'admin', _id: userId}]
        };
        request.post('groups', {body: body}, callback);
    },

    /**
     * Create Project
     *
     * Takes a group name and a project name and
     * generates a request to make a project in scitran.
     */
    createProject (groupName, body, callback) {
        request.post('groups/' + groupName + '/projects', {body: body}, callback);
    },

    /**
     * Create Subject
     *
     */
    createSubject (projectId, subjectName, callback) {
        let body = {label: subjectName, subject_code: 'subject'};
        request.post('projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Session
     *
     */
    createSession (projectId, subjectId, sessionName, callback) {
        let body = {label: sessionName, subject_code: subjectId};
        request.post('projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Modality
     *
     */
    createModality (sessionId, modalityName, callback) {
        let body = {label: modalityName, datatype: 'modality'};
        request.post('sessions/' + sessionId + '/acquisitions', {body: body}, callback);
    },

// Read -----------------------------------------------------------------------------------

    /**
     * Get Projects
     *
     */
    getProjects (callback) {
        request.get('projects', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Project
     *
     */
    getProject (projectId, callback) {
        request.get('projects/' + projectId, {}, (err, res) => {
            callback(res);
        });
    },

    /**
     * Get Sessions
     *
     */
    getSessions (projectId, callback) {
        request.get('projects/' + projectId + '/sessions', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Session
     *
     */
    getSession (sessionId, callback) {
        request.get('sessions/' + sessionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisitions
     *
     */
    getAcquisitions (sessionId, callback) {
        request.get('sessions/' + sessionId + '/acquisitions', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisition
     *
     */
    getAcquisition (acquisitionId, callback) {
        request.get('acquisitions/' + acquisitionId, {}, (err, res) => {
            callback(res.body);
        });
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Container
     *
     */
    deleteContainer (type, id, callback) {
        request.del(type + '/' + id, (err, res) => {
            callback();
        });
    },

// Update ---------------------------------------------------------------------------------

    /**
     * Update Project
     *
     */
    updateProject (projectId, body, callback) {
        request.put('projects/' + projectId, {body}, (err, res) => {
            callback(err, res);
        });
    },

    /**
     * Update Note
     *
     * Takes a projectId and a note object and
     * upserts the note.
     */
    updateNote (projectId, newNote, callback) {
        this.getProject(projectId, (res) => {
            let notes = [];
            let currentNotes = res.body.notes ? res.body.notes : [];
            let noteExists   = false;
            for (let currentNote of currentNotes) {
                if (currentNote.author === newNote.author) {
                    noteExists = true;
                    notes.push(newNote);
                } else {
                    notes.push(currentNote);
                }
            }
            if (!noteExists) {
                notes.push(newNote);
            }
            this.updateProject(projectId, {notes: notes}, (err, res) => {
                callback(res);
            });
        });
    }

};