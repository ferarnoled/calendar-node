/**
 * Created by FernandoA on 6/30/2017.
 */
var eventRequest = {
    event_id: 1,
    name: "PT Visit",
    case_id: 1,
    event_type_id: "Physical therapy", // [, med schedule]
    start_date: new Date(),
    end_date: new Date(),
    all_day: false,
    location: {
        name: "Physical Therapy Jen",
        address: "723 Marsh Rd, Apt 15, Menlo Park CA 94025",
        latitude: 3232,
        longitude: 323,

    }
}
var eventModel = {
        eventId: 1,
        name: "PT Visit",
        caseId: 1,
        eventyTypeId: 1, // [Physical therapy, med schedule]
        startDate: new Date(),
        endDate: new Date(),
        allDay: false,
        location
    }