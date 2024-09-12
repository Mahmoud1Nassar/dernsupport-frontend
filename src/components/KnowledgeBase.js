import React from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from '@mui/material';

const KnowledgeBase = () => {
    const questions = [
        { id: 1, question: 'How to install RAM?', type: 'Hardware', answer: 'To install RAM, open your computer case, locate the RAM slots on the motherboard, and carefully insert the RAM stick.' },
        { id: 2, question: 'What is an SSD?', type: 'Hardware', answer: 'An SSD (Solid State Drive) is a type of storage device that uses flash memory to store data.' },
        { id: 3, question: 'How to install software on Windows?', type: 'Software', answer: 'To install software on Windows, download the installer, run the .exe file, and follow the on-screen instructions.' },
        { id: 4, question: 'What is a firewall?', type: 'Software', answer: 'A firewall is a security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.' },
        { id: 5, question: 'How to replace a hard drive?', type: 'Hardware', answer: 'To replace a hard drive, power off the computer, open the case, disconnect the cables, remove the old hard drive, and install the new one.' },
        { id: 6, question: 'What is a GPU?', type: 'Hardware', answer: 'A GPU (Graphics Processing Unit) is a specialized processor designed to accelerate rendering of images and videos.' },
        { id: 7, question: 'How to set up a wireless network?', type: 'Software', answer: 'To set up a wireless network, connect the router to the modem, log into the router settings, and configure your wireless network name (SSID) and password.' },
        { id: 8, question: 'What is BIOS?', type: 'Hardware', answer: 'BIOS (Basic Input/Output System) is firmware used to initialize and test hardware during booting and to load the operating system.' },
        { id: 9, question: 'How to format a USB drive?', type: 'Software', answer: 'To format a USB drive, insert it into the computer, right-click the drive icon, select "Format," choose the file system, and click "Start."' },
        { id: 10, question: 'What is a VPN?', type: 'Software', answer: 'A VPN (Virtual Private Network) provides a secure connection to another network over the Internet by encrypting your connection.' },
        { id: 11, question: 'How to check for hardware compatibility?', type: 'Hardware', answer: 'To check for hardware compatibility, consult the motherboard’s manual or specifications to ensure that new hardware is supported.' },
        { id: 12, question: 'How to create a backup of important files?', type: 'Software', answer: 'To create a backup, use a backup utility or cloud storage to copy important files to an external drive or online storage service.' },
        { id: 13, question: 'What is a driver?', type: 'Software', answer: 'A driver is a piece of software that allows the operating system to communicate with hardware devices like printers, GPUs, and network cards.' },
        { id: 14, question: 'How to clean a computer?', type: 'Hardware', answer: 'To clean a computer, power it off, open the case, and use compressed air to remove dust from fans, heatsinks, and other components.' },
        { id: 15, question: 'What is an IP address?', type: 'Software', answer: 'An IP address (Internet Protocol address) is a unique string of numbers that identifies a device on a network.' },
        { id: 16, question: 'How to upgrade a CPU?', type: 'Hardware', answer: 'To upgrade a CPU, ensure your motherboard supports the new CPU, power off the system, remove the old CPU, install the new one, and reapply thermal paste.' },
        { id: 17, question: 'How to remove malware from a computer?', type: 'Software', answer: 'To remove malware, run an antivirus scan, use malware removal tools, and reset the browser settings if necessary.' },
        { id: 18, question: 'What is a power supply unit (PSU)?', type: 'Hardware', answer: 'A PSU (Power Supply Unit) is a component that converts electricity from the wall socket into the correct voltage for the computer’s components.' },
        { id: 19, question: 'How to install a printer on Windows?', type: 'Software', answer: 'To install a printer on Windows, connect it to the computer or network, and use the Add Printer wizard in the Control Panel or Settings.' },
        { id: 20, question: 'What is cloud storage?', type: 'Software', answer: 'Cloud storage allows users to store data on remote servers accessed over the Internet, offering secure backup and access from anywhere.' },
        { id: 21, question: 'How to partition a hard drive?', type: 'Software', answer: 'To partition a hard drive, use the Disk Management tool on Windows or Disk Utility on macOS to create, delete, and manage partitions.' },
        { id: 22, question: 'What is RAID?', type: 'Hardware', answer: 'RAID (Redundant Array of Independent Disks) is a technology that combines multiple hard drives into a single unit for redundancy or performance.' },
        { id: 23, question: 'How to recover lost data?', type: 'Software', answer: 'To recover lost data, use data recovery software like Recuva or EaseUS, or consult professional data recovery services if the data is critical.' },
        { id: 24, question: 'What is overclocking?', type: 'Hardware', answer: 'Overclocking is the process of increasing the clock speed of a computer component, such as the CPU or GPU, to improve performance.' },
        { id: 25, question: 'How to connect a computer to a projector?', type: 'Hardware', answer: 'To connect a computer to a projector, use an HDMI or VGA cable, set the correct input on the projector, and configure the display settings on the computer.' }
      ];
      

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Knowledge Base
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.question}</TableCell>
                <TableCell>{q.type}</TableCell>
                <TableCell>{q.answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default KnowledgeBase;
