import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import SafetyReport from '../models/safetyReportModel.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { sendAlertToSecurity, notifyEmergencyServices, makePublicAnnouncement } from '../tools/safetyTools.js';
import fs from 'fs';

// @desc    Create a new event
// @route   POST /api/safety/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { name, location, eventDate, description } = req.body;

  const event = new Event({
    name,
    location,
    eventDate,
    description,
    creator: req.user._id,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Get all upcoming events
// @route   GET /api/safety/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ eventDate: { $gte: new Date() } }).populate('creator', 'name');
  res.json(events);
});

// @desc    Join an event
// @route   POST /api/safety/events/:id/join
// @access  Private
const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    if (event.attendees.includes(req.user._id)) {
      res.status(400);
      throw new Error('User already joined this event');
    }
    event.attendees.push(req.user._id);
    await event.save();
    res.json({ message: 'Successfully joined event' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Submit a safety report
// @route   POST /api/safety/reports/:eventId
// @access  Private
const submitSafetyReport = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const { reportType, textContent } = req.body;
  
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
  
    // Ensure the user has joined the event to submit a report
    if (!event.attendees.map(id => id.toString()).includes(req.user._id.toString())) {
        res.status(403);
        throw new Error('User has not joined this event and cannot submit reports.');
    }

    const model = new ChatGoogleGenerativeAI({
        modelName: "gemini-1.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
    });

    const modelWithTools = model.bindTools([
        sendAlertToSecurity,
        notifyEmergencyServices,
        makePublicAnnouncement,
    ]);

    let messageContent;
    let imageUrl = '';

    if (reportType === 'image' && req.file) {
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = imageBuffer.toString('base64');
        imageUrl = `uploads/${req.file.filename}`;

        messageContent = {
            type: "image_url",
            image_url: `data:${req.file.mimetype};base64,${imageBase64}`,
        };
    } else if (reportType === 'text') {
        messageContent = textContent;
    } else {
        res.status(400);
        throw new Error('Invalid report type or missing content');
    }

    const prompt = `You are an expert crowd safety officer monitoring a large public event. Analyze the following content and determine if any action is required. The content was submitted by an attendee. If you detect a potential threat or safety issue, call the appropriate tool to mitigate it. If the situation is normal, just respond with "All clear."\n\nContent:`;

    const message = new HumanMessage({
        content: [
            { type: "text", text: prompt },
            messageContent,
        ],
    });

    const aiResponse = await modelWithTools.invoke([message]);
    
    let analysisResultText = 'No specific analysis text.';
    let actionTakenData = null;

    if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
        const toolCall = aiResponse.tool_calls[0];
        const tool = {
            sendAlertToSecurity,
            notifyEmergencyServices,
            makePublicAnnouncement,
        }[toolCall.name];

        if (tool) {
            const toolResult = await tool.invoke(toolCall.args);
            const parsedResult = JSON.parse(toolResult);
            analysisResultText = `AI detected an issue and took action: ${parsedResult.message}`;
            actionTakenData = {
                tool_called: toolCall.name,
                details: parsedResult.details,
            };
        }
    } else {
        analysisResultText = aiResponse.content;
    }

    // Save the report to the database
    const report = new SafetyReport({
        event: eventId,
        reportingUser: req.user._id,
        reportType,
        textContent: reportType === 'text' ? textContent : null,
        contentUrl: imageUrl || null,
        analysisResult: analysisResultText,
        actionTaken: actionTakenData,
    });

    await report.save();

    res.status(201).json({
        message: 'Report submitted successfully.',
        ai_analysis: analysisResultText,
        action_taken: actionTakenData,
    });
});


// @desc    DEMO: Create a report from simulated IoT data
// @route   POST /api/safety/demo/iot-data
// @access  Public
const createDemoIotReport = asyncHandler(async (req, res) => {
  // In a real scenario, you'd have logic to associate this with an event
  console.log('Received IoT Data:', req.body);
  res.status(200).json({ message: 'IoT data received and logged.' });
});

// @desc    DEMO: Create a report from simulated CCTV feed
// @route   POST /api/safety/demo/cctv-feed
// @access  Public
const createDemoCctvReport = asyncHandler(async (req, res) => {
  console.log('Received CCTV Feed URL:', req.body);
  res.status(200).json({ message: 'CCTV feed URL received and logged.' });
});

export {
  createEvent,
  getEvents,
  joinEvent,
  submitSafetyReport,
  createDemoIotReport,
  createDemoCctvReport,
};
