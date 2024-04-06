const roomsData = [
    {
        roomName: 'Lab1',
        roomCapacity: 45,
        timeslots: [
            { startTime: '09:00', endTime: '09:30'},
            { startTime: '09:30', endTime: '10:00'},
            { startTime: '10:30', endTime: '11:00'},
            { startTime: '11:00', endTime: '11:30'},
            { startTime: '11:30', endTime: '12:00'},
        ],
        inUse: 8,
        reserved: 5,
    },
    {
        roomName: 'Lab2',
        roomCapacity: 45,
        timeslots: [
            { startTime: '09:00', endTime: '09:30'},
            { startTime: '09:30', endTime: '10:00'},
            { startTime: '10:30', endTime: '11:00'},
            { startTime: '11:00', endTime: '11:30'},
            { startTime: '11:30', endTime: '12:00'},
        ],
        inUse: 8,
        reserved: 12,
    },
    {
        roomName: 'Lab3',
        roomCapacity: 45,
        timeslots: [
            { startTime: '09:00', endTime: '09:30'},
            { startTime: '09:30', endTime: '10:00'},
            { startTime: '10:30', endTime: '11:00'},
            { startTime: '11:00', endTime: '11:30'},
            { startTime: '11:30', endTime: '12:00'},
        ],
        inUse: 8,
        reserved: 0,
    },
    {
        roomName: 'Lab4',
        roomCapacity: 45,
        timeslots: [
            { startTime: '09:00', endTime: '09:30'},
            { startTime: '09:30', endTime: '10:00'},
            { startTime: '10:30', endTime: '11:00'},
            { startTime: '11:00', endTime: '11:30'},
            { startTime: '11:30', endTime: '12:00'},
        ],
        inUse: 10,
        reserved: 5,
    },
    {
        roomName: 'Lab5',
        roomCapacity: 45,
        timeslots: [
            { startTime: '09:00', endTime: '09:30'},
            { startTime: '09:30', endTime: '10:00'},
            { startTime: '10:30', endTime: '11:00'},
            { startTime: '11:00', endTime: '11:30'},
            { startTime: '11:30', endTime: '12:00'},
        ],
        inUse: 0,
        reserved: 0,
    }
 ];

 module.exports = roomsData;