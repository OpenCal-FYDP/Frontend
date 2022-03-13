// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// Source: calservice.proto

import {
    BinaryReader,
    BinaryWriter,
    JSONrequest,
    PBrequest,
  } from "twirpscript";
  // This is the minimum version supported by the current runtime.
  // If this line fails typechecking, breaking changes have been introduced and this
  // file needs to be regenerated by running `yarn twirpscript`.
  export { MIN_SUPPORTED_VERSION_0_0_44 } from "twirpscript";
  
  //================================================//
  // CalendarEventManagementService Protobuf Client //
  //================================================//
  
  /**
   * return the created event if successful
   */
  export async function CreateEvent(createEventReq, config) {
    const response = await PBrequest(
      "/CalendarEventManagementService/CreateEvent",
      CreateEventReq.encode(createEventReq),
      config
    );
    return CreateEventRes.decode(response);
  }
  
  /**
   * return the updated event if successful
   */
  export async function UpdateEvent(updateEventReq, config) {
    const response = await PBrequest(
      "/CalendarEventManagementService/UpdateEvent",
      UpdateEventReq.encode(updateEventReq),
      config
    );
    return UpdateEventRes.decode(response);
  }
  
  export async function DeleteEvent(deleteEventReq, config) {
    const response = await PBrequest(
      "/CalendarEventManagementService/DeleteEvent",
      DeleteEventReq.encode(deleteEventReq),
      config
    );
    return DeleteEventRes.decode(response);
  }
  
  /**
   * get event
   */
  export async function GetEvent(getEventReq, config) {
    const response = await PBrequest(
      "/CalendarEventManagementService/GetEvent",
      GetEventReq.encode(getEventReq),
      config
    );
    return GetEventRes.decode(response);
  }
  
  //============================================//
  // CalendarEventManagementService JSON Client //
  //============================================//
  
  /**
   * return the created event if successful
   */
  export async function CreateEventJSON(createEventReq, config) {
    const response = await JSONrequest(
      "/CalendarEventManagementService/CreateEvent",
      createEventReq,
      config
    );
    return response;
  }
  
  /**
   * return the updated event if successful
   */
  export async function UpdateEventJSON(updateEventReq, config) {
    const response = await JSONrequest(
      "/CalendarEventManagementService/UpdateEvent",
      updateEventReq,
      config
    );
    return response;
  }
  
  export async function DeleteEventJSON(deleteEventReq, config) {
    const response = await JSONrequest(
      "/CalendarEventManagementService/DeleteEvent",
      deleteEventReq,
      config
    );
    return response;
  }
  
  /**
   * get event
   */
  export async function GetEventJSON(getEventReq, config) {
    const response = await JSONrequest(
      "/CalendarEventManagementService/GetEvent",
      getEventReq,
      config
    );
    return response;
  }
  
  export function createCalendarEventManagementServiceHandler(service) {
    return {
      name: "CalendarEventManagementService",
      methods: {
        CreateEvent: {
          name: "CreateEvent",
          handler: service.CreateEvent,
          input: CreateEventReq,
          output: CreateEventRes,
        },
        UpdateEvent: {
          name: "UpdateEvent",
          handler: service.UpdateEvent,
          input: UpdateEventReq,
          output: UpdateEventRes,
        },
        DeleteEvent: {
          name: "DeleteEvent",
          handler: service.DeleteEvent,
          input: DeleteEventReq,
          output: DeleteEventRes,
        },
        GetEvent: {
          name: "GetEvent",
          handler: service.GetEvent,
          input: GetEventReq,
          output: GetEventRes,
        },
      },
    };
  }
  
  //========================================//
  //        Protobuf Encode / Decode        //
  //========================================//
  
  export const CalEvent = {
    /**
     * Serializes a CalEvent to protobuf.
     */
    encode: function (calEvent) {
      return CalEvent._writeMessage(
        calEvent,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a CalEvent from protobuf.
     */
    decode: function (bytes) {
      return CalEvent._readMessage(
        CalEvent.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a CalEvent to JSON.
     */
    encodeJSON: function (calEvent) {
      return JSON.stringify(CalEvent._writeMessageJSON(calEvent));
    },
  
    /**
     * Deserializes a CalEvent from JSON.
     */
    decodeJSON: function (json) {
      return CalEvent._readMessageJSON(CalEvent.initialize(), JSON.parse(json));
    },
  
    /**
     * Initializes a CalEvent with all fields set to their default value.
     */
    initialize: function () {
      return {
        summary: "",
        location: "",
        Start: 0n,
        end: 0n,
        recurrence: [],
        attendees: [],
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.summary) {
        writer.writeString(1, msg.summary);
      }
      if (msg.location) {
        writer.writeString(2, msg.location);
      }
      if (msg.Start) {
        writer.writeInt64String(3, msg.Start.toString());
      }
      if (msg.end) {
        writer.writeInt64String(4, msg.end.toString());
      }
      if (msg.recurrence?.length) {
        writer.writeRepeatedString(5, msg.recurrence);
      }
      if (msg.attendees?.length) {
        writer.writeRepeatedString(6, msg.attendees);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.summary) {
        json.summary = msg.summary;
      }
      if (msg.location) {
        json.location = msg.location;
      }
      if (msg.Start) {
        json.Start = msg.Start.toString();
      }
      if (msg.end) {
        json.end = msg.end.toString();
      }
      if (msg.recurrence?.length) {
        json.recurrence = msg.recurrence;
      }
      if (msg.attendees?.length) {
        json.attendees = msg.attendees;
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.summary = reader.readString();
            break;
          }
          case 2: {
            msg.location = reader.readString();
            break;
          }
          case 3: {
            msg.Start = BigInt(reader.readInt64String());
            break;
          }
          case 4: {
            msg.end = BigInt(reader.readInt64String());
            break;
          }
          case 5: {
            msg.recurrence.push(reader.readString());
            break;
          }
          case 6: {
            msg.attendees.push(reader.readString());
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const summary = json.summary ?? json.summary;
      if (summary) {
        msg.summary = summary;
      }
      const location = json.location ?? json.location;
      if (location) {
        msg.location = location;
      }
      const Start = json.Start ?? json.Start;
      if (Start) {
        msg.Start = BigInt(Start);
      }
      const end = json.end ?? json.end;
      if (end) {
        msg.end = BigInt(end);
      }
      const recurrence = json.recurrence ?? json.recurrence;
      if (recurrence) {
        msg.recurrence = recurrence;
      }
      const attendees = json.attendees ?? json.attendees;
      if (attendees) {
        msg.attendees = attendees;
      }
      return msg;
    },
  };
  
  export const CreateEventReq = {
    /**
     * Serializes a CreateEventReq to protobuf.
     */
    encode: function (createEventReq) {
      return CreateEventReq._writeMessage(
        createEventReq,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a CreateEventReq from protobuf.
     */
    decode: function (bytes) {
      return CreateEventReq._readMessage(
        CreateEventReq.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a CreateEventReq to JSON.
     */
    encodeJSON: function (createEventReq) {
      return JSON.stringify(CreateEventReq._writeMessageJSON(createEventReq));
    },
  
    /**
     * Deserializes a CreateEventReq from JSON.
     */
    decodeJSON: function (json) {
      return CreateEventReq._readMessageJSON(
        CreateEventReq.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a CreateEventReq with all fields set to their default value.
     */
    initialize: function () {
      return {
        calendarId: "",
        eventId: "",
        event: CalEvent.initialize(),
        ownerOfEvent: "",
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.calendarId) {
        writer.writeString(1, msg.calendarId);
      }
      if (msg.eventId) {
        writer.writeString(2, msg.eventId);
      }
      if (msg.event) {
        writer.writeMessage(4, msg.event, CalEvent._writeMessage);
      }
      if (msg.ownerOfEvent) {
        writer.writeString(5, msg.ownerOfEvent);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.calendarId) {
        json.calendarId = msg.calendarId;
      }
      if (msg.eventId) {
        json.eventId = msg.eventId;
      }
      if (msg.event) {
        const event = CalEvent._writeMessageJSON(msg.event);
        if (Object.keys(event).length > 0) {
          json.event = event;
        }
      }
      if (msg.ownerOfEvent) {
        json.ownerOfEvent = msg.ownerOfEvent;
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.calendarId = reader.readString();
            break;
          }
          case 2: {
            msg.eventId = reader.readString();
            break;
          }
          case 4: {
            reader.readMessage(msg.event, CalEvent._readMessage);
            break;
          }
          case 5: {
            msg.ownerOfEvent = reader.readString();
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const calendarId = json.calendarId ?? json.calendarId;
      if (calendarId) {
        msg.calendarId = calendarId;
      }
      const eventId = json.eventId ?? json.eventId;
      if (eventId) {
        msg.eventId = eventId;
      }
      const event = json.event ?? json.event;
      if (event) {
        const m = CalEvent.initialize();
        CalEvent._readMessageJSON(m, event);
        msg.event = m;
      }
      const ownerOfEvent = json.ownerOfEvent ?? json.ownerOfEvent;
      if (ownerOfEvent) {
        msg.ownerOfEvent = ownerOfEvent;
      }
      return msg;
    },
  };
  
  export const CreateEventRes = {
    /**
     * Serializes a CreateEventRes to protobuf.
     */
    encode: function (createEventRes) {
      return CreateEventRes._writeMessage(
        createEventRes,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a CreateEventRes from protobuf.
     */
    decode: function (bytes) {
      return CreateEventRes._readMessage(
        CreateEventRes.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a CreateEventRes to JSON.
     */
    encodeJSON: function (createEventRes) {
      return JSON.stringify(CreateEventRes._writeMessageJSON(createEventRes));
    },
  
    /**
     * Deserializes a CreateEventRes from JSON.
     */
    decodeJSON: function (json) {
      return CreateEventRes._readMessageJSON(
        CreateEventRes.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a CreateEventRes with all fields set to their default value.
     */
    initialize: function () {
      return {
        calendarId: "",
        eventId: "",
        event: CalEvent.initialize(),
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.calendarId) {
        writer.writeString(1, msg.calendarId);
      }
      if (msg.eventId) {
        writer.writeString(2, msg.eventId);
      }
      if (msg.event) {
        writer.writeMessage(3, msg.event, CalEvent._writeMessage);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.calendarId) {
        json.calendarId = msg.calendarId;
      }
      if (msg.eventId) {
        json.eventId = msg.eventId;
      }
      if (msg.event) {
        const event = CalEvent._writeMessageJSON(msg.event);
        if (Object.keys(event).length > 0) {
          json.event = event;
        }
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.calendarId = reader.readString();
            break;
          }
          case 2: {
            msg.eventId = reader.readString();
            break;
          }
          case 3: {
            reader.readMessage(msg.event, CalEvent._readMessage);
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const calendarId = json.calendarId ?? json.calendarId;
      if (calendarId) {
        msg.calendarId = calendarId;
      }
      const eventId = json.eventId ?? json.eventId;
      if (eventId) {
        msg.eventId = eventId;
      }
      const event = json.event ?? json.event;
      if (event) {
        const m = CalEvent.initialize();
        CalEvent._readMessageJSON(m, event);
        msg.event = m;
      }
      return msg;
    },
  };
  
  export const UpdateEventReq = {
    /**
     * Serializes a UpdateEventReq to protobuf.
     */
    encode: function (updateEventReq) {
      return UpdateEventReq._writeMessage(
        updateEventReq,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a UpdateEventReq from protobuf.
     */
    decode: function (bytes) {
      return UpdateEventReq._readMessage(
        UpdateEventReq.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a UpdateEventReq to JSON.
     */
    encodeJSON: function (updateEventReq) {
      return JSON.stringify(UpdateEventReq._writeMessageJSON(updateEventReq));
    },
  
    /**
     * Deserializes a UpdateEventReq from JSON.
     */
    decodeJSON: function (json) {
      return UpdateEventReq._readMessageJSON(
        UpdateEventReq.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a UpdateEventReq with all fields set to their default value.
     */
    initialize: function () {
      return {
        calendarId: "",
        eventId: "",
        event: CalEvent.initialize(),
        ownerOfEvent: "",
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.calendarId) {
        writer.writeString(1, msg.calendarId);
      }
      if (msg.eventId) {
        writer.writeString(2, msg.eventId);
      }
      if (msg.event) {
        writer.writeMessage(4, msg.event, CalEvent._writeMessage);
      }
      if (msg.ownerOfEvent) {
        writer.writeString(5, msg.ownerOfEvent);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.calendarId) {
        json.calendarId = msg.calendarId;
      }
      if (msg.eventId) {
        json.eventId = msg.eventId;
      }
      if (msg.event) {
        const event = CalEvent._writeMessageJSON(msg.event);
        if (Object.keys(event).length > 0) {
          json.event = event;
        }
      }
      if (msg.ownerOfEvent) {
        json.ownerOfEvent = msg.ownerOfEvent;
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.calendarId = reader.readString();
            break;
          }
          case 2: {
            msg.eventId = reader.readString();
            break;
          }
          case 4: {
            reader.readMessage(msg.event, CalEvent._readMessage);
            break;
          }
          case 5: {
            msg.ownerOfEvent = reader.readString();
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const calendarId = json.calendarId ?? json.calendarId;
      if (calendarId) {
        msg.calendarId = calendarId;
      }
      const eventId = json.eventId ?? json.eventId;
      if (eventId) {
        msg.eventId = eventId;
      }
      const event = json.event ?? json.event;
      if (event) {
        const m = CalEvent.initialize();
        CalEvent._readMessageJSON(m, event);
        msg.event = m;
      }
      const ownerOfEvent = json.ownerOfEvent ?? json.ownerOfEvent;
      if (ownerOfEvent) {
        msg.ownerOfEvent = ownerOfEvent;
      }
      return msg;
    },
  };
  
  export const UpdateEventRes = {
    /**
     * Serializes a UpdateEventRes to protobuf.
     */
    encode: function (updateEventRes) {
      return UpdateEventRes._writeMessage(
        updateEventRes,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a UpdateEventRes from protobuf.
     */
    decode: function (bytes) {
      return UpdateEventRes._readMessage(
        UpdateEventRes.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a UpdateEventRes to JSON.
     */
    encodeJSON: function (updateEventRes) {
      return JSON.stringify(UpdateEventRes._writeMessageJSON(updateEventRes));
    },
  
    /**
     * Deserializes a UpdateEventRes from JSON.
     */
    decodeJSON: function (json) {
      return UpdateEventRes._readMessageJSON(
        UpdateEventRes.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a UpdateEventRes with all fields set to their default value.
     */
    initialize: function () {
      return {
        calendarId: "",
        eventId: "",
        event: CalEvent.initialize(),
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.calendarId) {
        writer.writeString(1, msg.calendarId);
      }
      if (msg.eventId) {
        writer.writeString(2, msg.eventId);
      }
      if (msg.event) {
        writer.writeMessage(3, msg.event, CalEvent._writeMessage);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.calendarId) {
        json.calendarId = msg.calendarId;
      }
      if (msg.eventId) {
        json.eventId = msg.eventId;
      }
      if (msg.event) {
        const event = CalEvent._writeMessageJSON(msg.event);
        if (Object.keys(event).length > 0) {
          json.event = event;
        }
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.calendarId = reader.readString();
            break;
          }
          case 2: {
            msg.eventId = reader.readString();
            break;
          }
          case 3: {
            reader.readMessage(msg.event, CalEvent._readMessage);
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const calendarId = json.calendarId ?? json.calendarId;
      if (calendarId) {
        msg.calendarId = calendarId;
      }
      const eventId = json.eventId ?? json.eventId;
      if (eventId) {
        msg.eventId = eventId;
      }
      const event = json.event ?? json.event;
      if (event) {
        const m = CalEvent.initialize();
        CalEvent._readMessageJSON(m, event);
        msg.event = m;
      }
      return msg;
    },
  };
  
  export const DeleteEventReq = {
    /**
     * Serializes a DeleteEventReq to protobuf.
     */
    encode: function (deleteEventReq) {
      return DeleteEventReq._writeMessage(
        deleteEventReq,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a DeleteEventReq from protobuf.
     */
    decode: function (bytes) {
      return DeleteEventReq._readMessage(
        DeleteEventReq.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a DeleteEventReq to JSON.
     */
    encodeJSON: function (deleteEventReq) {
      return JSON.stringify(DeleteEventReq._writeMessageJSON(deleteEventReq));
    },
  
    /**
     * Deserializes a DeleteEventReq from JSON.
     */
    decodeJSON: function (json) {
      return DeleteEventReq._readMessageJSON(
        DeleteEventReq.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a DeleteEventReq with all fields set to their default value.
     */
    initialize: function () {
      return {
        calendarId: "",
        eventId: "",
        ownerOfEvent: "",
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.calendarId) {
        writer.writeString(1, msg.calendarId);
      }
      if (msg.eventId) {
        writer.writeString(2, msg.eventId);
      }
      if (msg.ownerOfEvent) {
        writer.writeString(5, msg.ownerOfEvent);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.calendarId) {
        json.calendarId = msg.calendarId;
      }
      if (msg.eventId) {
        json.eventId = msg.eventId;
      }
      if (msg.ownerOfEvent) {
        json.ownerOfEvent = msg.ownerOfEvent;
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.calendarId = reader.readString();
            break;
          }
          case 2: {
            msg.eventId = reader.readString();
            break;
          }
          case 5: {
            msg.ownerOfEvent = reader.readString();
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const calendarId = json.calendarId ?? json.calendarId;
      if (calendarId) {
        msg.calendarId = calendarId;
      }
      const eventId = json.eventId ?? json.eventId;
      if (eventId) {
        msg.eventId = eventId;
      }
      const ownerOfEvent = json.ownerOfEvent ?? json.ownerOfEvent;
      if (ownerOfEvent) {
        msg.ownerOfEvent = ownerOfEvent;
      }
      return msg;
    },
  };
  
  export const DeleteEventRes = {
    /**
     * Serializes a DeleteEventRes to protobuf.
     */
  
    encode: function (_deleteEventRes) {
      return new Uint8Array();
    },
  
    /**
     * Deserializes a DeleteEventRes from protobuf.
     */
  
    decode: function (_bytes) {
      return {};
    },
  
    /**
     * Serializes a DeleteEventRes to JSON.
     */
  
    encodeJSON: function (_deleteEventRes) {
      return "{}";
    },
  
    /**
     * Deserializes a DeleteEventRes from JSON.
     */
  
    decodeJSON: function (_json) {
      return {};
    },
  
    /**
     * Initializes a DeleteEventRes with all fields set to their default value.
     */
    initialize: function () {
      return {};
    },
  };
  
  export const GetEventReq = {
    /**
     * Serializes a GetEventReq to protobuf.
     */
    encode: function (getEventReq) {
      return GetEventReq._writeMessage(
        getEventReq,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a GetEventReq from protobuf.
     */
    decode: function (bytes) {
      return GetEventReq._readMessage(
        GetEventReq.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a GetEventReq to JSON.
     */
    encodeJSON: function (getEventReq) {
      return JSON.stringify(GetEventReq._writeMessageJSON(getEventReq));
    },
  
    /**
     * Deserializes a GetEventReq from JSON.
     */
    decodeJSON: function (json) {
      return GetEventReq._readMessageJSON(
        GetEventReq.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a GetEventReq with all fields set to their default value.
     */
    initialize: function () {
      return {
        eventId: "",
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.eventId) {
        writer.writeString(1, msg.eventId);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.eventId) {
        json.eventId = msg.eventId;
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            msg.eventId = reader.readString();
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const eventId = json.eventId ?? json.eventId;
      if (eventId) {
        msg.eventId = eventId;
      }
      return msg;
    },
  };
  
  export const GetEventRes = {
    /**
     * Serializes a GetEventRes to protobuf.
     */
    encode: function (getEventRes) {
      return GetEventRes._writeMessage(
        getEventRes,
        new BinaryWriter()
      ).getResultBuffer();
    },
  
    /**
     * Deserializes a GetEventRes from protobuf.
     */
    decode: function (bytes) {
      return GetEventRes._readMessage(
        GetEventRes.initialize(),
        new BinaryReader(bytes)
      );
    },
  
    /**
     * Serializes a GetEventRes to JSON.
     */
    encodeJSON: function (getEventRes) {
      return JSON.stringify(GetEventRes._writeMessageJSON(getEventRes));
    },
  
    /**
     * Deserializes a GetEventRes from JSON.
     */
    decodeJSON: function (json) {
      return GetEventRes._readMessageJSON(
        GetEventRes.initialize(),
        JSON.parse(json)
      );
    },
  
    /**
     * Initializes a GetEventRes with all fields set to their default value.
     */
    initialize: function () {
      return {
        event: CalEvent.initialize(),
      };
    },
  
    /**
     * @private
     */
    _writeMessage: function (msg, writer) {
      if (msg.event) {
        writer.writeMessage(1, msg.event, CalEvent._writeMessage);
      }
      return writer;
    },
  
    /**
     * @private
     */
    _writeMessageJSON: function (msg) {
      const json = {};
      if (msg.event) {
        const event = CalEvent._writeMessageJSON(msg.event);
        if (Object.keys(event).length > 0) {
          json.event = event;
        }
      }
      return json;
    },
  
    /**
     * @private
     */
    _readMessage: function (msg, reader) {
      while (reader.nextField()) {
        const field = reader.getFieldNumber();
        switch (field) {
          case 1: {
            reader.readMessage(msg.event, CalEvent._readMessage);
            break;
          }
          default: {
            reader.skipField();
            break;
          }
        }
      }
      return msg;
    },
  
    /**
     * @private
     */
    _readMessageJSON: function (msg, json) {
      const event = json.event ?? json.event;
      if (event) {
        const m = CalEvent.initialize();
        CalEvent._readMessageJSON(m, event);
        msg.event = m;
      }
      return msg;
    },
  };