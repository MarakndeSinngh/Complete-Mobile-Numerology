import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice, PersonalDetails } from '../types';
import { computeLoshuAnalysis, LoshuAnalysisResult } from '../services/loshuEngine';
import { Sparkles, Briefcase, Heart, Activity } from 'lucide-react';
import { generateLeoAdvisorActions } from '../services/leoAdvisorEngine';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportTabProps {
  personalDetails: PersonalDetails;
  dobData: DOBAnalysis;
  nameData: NameAnalysis;
  mobileData: MobileAnalysis;
  remedies: remediesAdvice;
}

const ReportTab: React.FC<ReportTabProps> = ({ personalDetails, dobData, nameData, mobileData, remedies }) => {
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const advisorActions = reportText ? generateLeoAdvisorActions(dobData, nameData, mobileData) : null;

  const handleGenerateReport = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalDetails,
          dobAnalysis: dobData,
          nameAnalysis: nameData,
          mobileAnalysis: mobileData,
          remedies
        })
      });
      const data = await response.json();
      if (data.report) {
        setReportText(data.report);
      } else if (data.error) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage('Celestial wave obstruction. Please try again in a few moments.');
      }
    } catch (err) {
      setErrorMessage('Could not establish connection with servers. Please check if your GEMINI_API_KEY is correctly set in your environment configuration (Settings > Secrets).');
    } finally {
      setLoading(false);
    }
  };

  const getPlanetaryStrength = (num: number, analysis: LoshuAnalysisResult) => {
    let score = 15;
    const gridBox = analysis.loshuGrid[num];
    if (gridBox && gridBox.count > 0) {
      score += Math.min(gridBox.count, 3) * 20; // 20% for each count up to 3 occurrences (60%)
    }
    if (analysis.mulank === num) {
      score += 25;
    }
    if (analysis.bhagyank === num) {
      score += 25;
    }
    return Math.min(score, 100);
  };

  const formatMarkdownForPrint = (markdown: string): string => {
    let html = markdown;
    
    // Replace headings
    html = html.replace(/^### (.*$)/gim, '<h4 style="font-family: \'Playfair Display\', serif; color: #1F2937; font-size: 15px; margin: 20px 0 10px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="font-family: \'Playfair Display\', serif; color: #D97706; font-size: 17px; margin: 25px 0 12px 0; border-bottom: 1px dashed #D97706; padding-bottom: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="font-family: \'Playfair Display\', serif; color: #B45309; font-size: 20px; margin: 30px 0 15px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">$1</h2>');
    
    // Replace bold and italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111827; font-weight: 700;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4B5563;">$1</em>');
    
    // Replace blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid #D97706; background-color: #FDFCF7; padding: 10px 16px; margin: 12px 0; font-style: italic; color: #4B5563; border-radius: 0 8px 8px 0;">$1</blockquote>');
    
    // Replace list items
    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li style="margin-left: 18px; list-style-type: square; margin-bottom: 5px; font-size: 12px; color: #4B5563;">$1</li>');
    
    // Replace double line breaks with paragraph tags
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<blockquote') || p.startsWith('<li')) {
        return p;
      }
      return `<p style="margin-bottom: 12px; font-size: 12px; line-height: 1.6; color: #4B5563; font-family: 'Inter', sans-serif;">${p.replace(/\n/g, '<br />')}</p>`;
    }).join('');
    
    return html;
  };

  const renderLoshuGridHTML = (analysis: LoshuAnalysisResult) => {
    const order = [4, 9, 2, 3, 5, 7, 8, 1, 6];
    let gridHTML = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 280px; margin: 0 auto; aspect-ratio: 1/1;">';
    
    order.forEach(digit => {
      const box = analysis.loshuGrid[digit];
      const count = box ? box.count : 0;
      const dobCount = box && box.dobCount ? box.dobCount : 0;
      const element = box ? box.element : '';
      
      let style = 'background-color: #F9FAFB; color: #9CA3AF; border: 1.5px dashed #E5E7EB;';
      if (count > 0) {
        switch (element.toLowerCase()) {
          case 'water':
            style = 'background-color: #EFF6FF; color: #1E40AF; border: 1.5px solid #BFDBFE;';
            break;
          case 'wood':
            style = 'background-color: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;';
            break;
          case 'earth':
            style = 'background-color: #FFFBEB; color: #92400E; border: 1.5px solid #FDE68A;';
            break;
          case 'metal':
            style = 'background-color: #F1F5F9; color: #334155; border: 1.5px solid #CBD5E1;';
            break;
          case 'fire':
            style = 'background-color: #FEF2F2; color: #991B1B; border: 1.5px solid #FCA5A5;';
            break;
        }
      }
      
      let circles = '';
      if (dobCount > 0) {
        for (let i = 0; i < Math.min(dobCount, 4); i++) {
          circles += `<span style="display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background-color: #FFFFFF; border: 1px solid #CBD5E1; font-family: monospace; font-weight: 900; font-size: 9px; color: #1F2937; margin: 1px;">${digit}</span>`;
        }
      }
      
      let badges = '';
      if (box) {
        if (box.isDriverLayer) {
          badges += `<span style="display: inline-block; padding: 1px 3px; border-radius: 3px; background-color: #D97706; color: #FFFFFF; font-size: 6px; font-weight: bold; font-family: monospace; margin: 1px;">DR:LYR</span>`;
        }
        if (box.isDriverReinforced) {
          badges += `<span style="display: inline-block; padding: 1px 3px; border-radius: 3px; background-color: #D97706; color: #FFFFFF; font-size: 6px; font-weight: bold; font-family: monospace; margin: 1px;">DR:REINF</span>`;
        }
        if (box.isDestinyLayer) {
          badges += `<span style="display: inline-block; padding: 1px 3px; border-radius: 3px; background-color: #2563EB; color: #FFFFFF; font-size: 6px; font-weight: bold; font-family: monospace; margin: 1px;">DEST:LYR</span>`;
        }
        if (box.isDestinyReinforced) {
          badges += `<span style="display: inline-block; padding: 1px 3px; border-radius: 3px; background-color: #4338CA; color: #FFFFFF; font-size: 6px; font-weight: bold; font-family: monospace; margin: 1px;">DEST:REINF</span>`;
        }
      }
      
      if (count === 0) {
        circles = '<span style="font-size: 8px; font-weight: bold; color: #9CA3AF; letter-spacing: 0.5px;">MISSING</span>';
      }
      
      const label = element ? `${element}` : `Digit ${digit}`;
      
      gridHTML += `
        <div style="border-radius: 12px; padding: 6px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 86px; text-align: center; box-sizing: border-box; ${style}">
          <span style="font-size: 9px; opacity: 0.35; font-weight: 800; align-self: flex-start; line-height: 1;">${digit}</span>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px;">
              ${circles}
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px;">
              ${badges}
            </div>
          </div>
          <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; opacity: 0.8; letter-spacing: 0.5px;">${label}</span>
        </div>
      `;
    });
    
    gridHTML += '</div>';
    return gridHTML;
  };

  const renderPlanetaryStrengthsHTML = (analysis: LoshuAnalysisResult) => {
    const planets = [
      { num: 1, name: 'Sun (सूर्य)', col: '#F59E0B' },
      { num: 2, name: 'Moon (चन्द्र)', col: '#38BDF8' },
      { num: 3, name: 'Jupiter (गुरु)', col: '#EAB308' },
      { num: 4, name: 'Rahu (राहू)', col: '#64748B' },
      { num: 5, name: 'Mercury (बुध)', col: '#10B981' },
      { num: 6, name: 'Venus (शुक्र)', col: '#EC4899' },
      { num: 7, name: 'Ketu (केतु)', col: '#8B5CF6' },
      { num: 8, name: 'Saturn (शनि)', col: '#312E81' },
      { num: 9, name: 'Mars (मंगल)', col: '#EF4444' }
    ];
    
    let html = '<div style="display: flex; flex-direction: column; gap: 7px;">';
    
    planets.forEach(p => {
      const strength = getPlanetaryStrength(p.num, analysis);
      
      let statusText = 'BALANCED';
      let statusStyle = 'background-color: #F1F5F9; color: #475569; border: 1px solid #E2E8F0;';
      if (strength >= 80) {
        statusText = 'EXALTED';
        statusStyle = 'background-color: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0;';
      } else if (strength >= 60) {
        statusText = 'STRONG';
        statusStyle = 'background-color: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE;';
      } else if (strength < 40) {
        statusText = 'REMEDY REQ.';
        statusStyle = 'background-color: #FEF2F2; color: #991B1B; border: 1px solid #FCA5A5;';
      }
      
      html += `
        <div style="display: flex; flex-direction: column; gap: 3px; page-break-inside: avoid; break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
            <span style="font-weight: 700; color: #374151;">${p.name} - #${p.num}</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-weight: 800; color: #1F2937;">${strength}%</span>
              <span style="font-size: 7.5px; font-weight: bold; padding: 1px 4px; border-radius: 3px; ${statusStyle}">${statusText}</span>
            </div>
          </div>
          <div style="width: 100%; height: 5px; background-color: #E5E7EB; border-radius: 3px; overflow: hidden; position: relative;">
            <div style="width: ${strength}%; height: 100%; background-color: ${p.col}; border-radius: 3px;"></div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  };

  const renderPlanesHTML = (analysis: LoshuAnalysisResult) => {
    let html = '<div style="display: flex; flex-direction: column; gap: 6px;">';
    const allPlanes = [...analysis.strengthArrows, ...analysis.weaknessArrows];
    
    allPlanes.forEach((plane) => {
      const isStrength = plane.status === 'FULL';
      const statusBg = isStrength ? '#ECFDF5' : plane.status === 'PARTIAL' ? '#FFFBEB' : '#FEF2F2';
      const statusCol = isStrength ? '#047857' : plane.status === 'PARTIAL' ? '#B45309' : '#B91C1C';
      const borderCol = isStrength ? '#A7F3D0' : plane.status === 'PARTIAL' ? '#FDE68A' : '#FCA5A5';
      
      html += `
        <div style="padding: 8px 12px; border-radius: 10px; border: 1px solid ${borderCol}; background-color: ${statusBg}; display: flex; flex-direction: column; gap: 3px; page-break-inside: avoid; break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; font-size: 10px; color: #1F2937;">${plane.name}</span>
            <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: ${statusCol};">${plane.status} (${plane.strengthScore}%)</span>
          </div>
          <p style="font-size: 9px; color: #4B5563; margin: 0; line-height: 1.3;">${plane.description}</p>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  };

  const reduceToSingleDigit = (num: number): number => {
    let temp = num;
    while (temp > 9) {
      temp = temp.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return temp;
  };

  const getDoshaData = (mulank: number) => {
    if ([1, 3, 9].includes(mulank)) {
      return {
        name: 'Pitta (पित्त - Fire & Water)',
        strength: '78% (Extremely Active)',
        digestive: 'Strong but prone to hyperacidity (तीक्ष्णाग्नि)',
        systems: 'Cardiovascular system, arterial flow, inflammatory pathways, eyesight.',
        foods: 'Cooling foods, sweet mature fruits (grapes, melons), coconut milk, green leafy vegetables, fennel, ghee.',
        avoid: 'Extremely spicy curries, fried fast foods, vinegar, tomatoes, citrus items, excessive caffeine, and alcohol.',
        fruits: 'Pomegranates, ripe grapes, sweet apples, honeydew melons, sweet blue berries.',
        sleep: '7 to 8 hours. Sleep in a cool, well-ventilated bedroom. Lie on your right side to stimulate cooling flow.',
        routine: 'Wake up at dawn. Engage in gentle meditation, drink water stored in a copper vessel, and practice Sheetali Pranayama.'
      };
    } else if ([2, 6, 7].includes(mulank)) {
      return {
        name: 'Kapha (कफ - Earth & Water)',
        strength: '84% (Prone to Sluggishness)',
        digestive: 'Slow metabolic digestion, prone to water retention (मन्दाग्नि)',
        systems: 'Respiratory system, sinus cavities, lymphatic drainage, synovial fluids.',
        foods: 'Warm cooked meals, light grains like quinoa, millet, and barley. Bitter leafy greens, ginger tea, steamed vegetables.',
        avoid: 'Heavy dairy products (cheese, thick creams), ice creams, cold carbonated drinks, overripe bananas, salted wheat.',
        fruits: 'Pears, apples, papayas, dried figs, and cranberries in moderation.',
        sleep: '7 hours. Strictly avoid daytime sleeping as it worsens Kapha. Wake up before sunrise to spark mental agility.',
        routine: 'Perform dry skin brushing (Garshana) toward the heart. Practice dynamic yoga postures (Surya Namaskar) to activate circulation.'
      };
    } else {
      return {
        name: 'Vata (वात - Air & Space)',
        strength: '72% (Highly Fluctuary)',
        digestive: 'Irregular and sensitive digestive fire, prone to gas and bloating (विषमाग्नि)',
        systems: 'Central nervous system, colon absorption, bone joint lubrication, skin dryness.',
        foods: 'Warm, moist, grounding cooked meals. Healthy cooking oils (sesame, olive, ghee). Warm whole-oat soups, spiced basmati rice.',
        avoid: 'Raw vegetables, cold garden salads, carbonated beverages, dry snacks, beans, and frozen items.',
        fruits: 'Ripe sweet bananas, sweet mangoes, avocados, soaked almonds, dates, and sweet plums.',
        sleep: '8 hours of sound sleep. Maintain a highly consistent sleep schedule. Massage your feet with warm sesame oil before resting.',
        routine: 'Grounding meditation, self-massage with warm herbal oils (Abhyanga), and consuming warm ginger water.'
      };
    }
  };

  const getPersonalYearData = (year: number, bDay: number, bMonth: number) => {
    const dReduced = reduceToSingleDigit(bDay);
    const mReduced = reduceToSingleDigit(bMonth);
    const yReduced = reduceToSingleDigit(year);
    const pyNum = reduceToSingleDigit(dReduced + mReduced + yReduced);
    
    const pyThemes: Record<number, { theme: string; lord: string; vibe: string; desc: string }> = {
      1: { theme: 'New Beginnings & Leadership (नव आरंभ)', lord: 'Sun (सूर्य)', vibe: '95%', desc: 'Excellent for starting fresh commercial ventures, changing titles, and independent goals.' },
      2: { theme: 'Patience, Harmony & Cooperation (साझेदारी)', lord: 'Moon (चन्द्र)', vibe: '75%', desc: 'A slow-paced year focusing on marriage counseling, teamwork, agreements, and emotional healing.' },
      3: { theme: 'Knowledge, Wisdom & Expansion (ज्ञान विस्तार)', lord: 'Jupiter (गुरु)', vibe: '90%', desc: 'Highly auspicious for academic certifications, writing, mentoring, and financial luck.' },
      4: { theme: 'Structure, Discipline & Foundation (कठिन परिश्रम)', lord: 'Rahu (राहू)', vibe: '65%', desc: 'Demands massive grounding, structural safety, system audits, and high risk prevention.' },
      5: { theme: 'Dynamic Shifts, Public Relations & Change (संचार)', lord: 'Mercury (बुध)', vibe: '85%', desc: 'A swift moving year for foreign travels, digital business launches, and mass PR campaigns.' },
      6: { theme: 'Luxury, Family Harmony & Peace (सुख-समृद्धि)', lord: 'Venus (शुक्र)', vibe: '90%', desc: 'Superb for buying luxury vehicles, domestic comforts, home decoration, and love.' },
      7: { theme: 'Self-Reflection, Spirituality & Solitude (चिंतन)', lord: 'Ketu (केतु)', vibe: '60%', desc: 'An introspective spiritual sabbatical. Avoid entering highly speculative ventures.' },
      8: { theme: 'Material Abundance & Harvest (कर्म फल)', lord: 'Saturn (शनि)', vibe: '85%', desc: 'Clear older pending files, buy real estate, deliver hard work, and harvest rewards.' },
      9: { theme: 'Completion, Cleansing & Philanthropy (विसर्जन)', lord: 'Mars (मंगल)', vibe: '70%', desc: 'Wash away old toxic habits, declutter spaces, and prepare for the next nine-year cycle.' }
    };
    
    return {
      year,
      number: pyNum,
      ...pyThemes[pyNum]
    };
  };

  const generateFullBrandedReportHTML = (
    details: PersonalDetails,
    dob: DOBAnalysis,
    name: NameAnalysis,
    mobile: MobileAnalysis,
    rem: remediesAdvice,
    reportId: string,
    currentDateStr: string,
    analysis: LoshuAnalysisResult,
    advisorActions: any
  ) => {
    const parts = details.dob.split('-');
    const bMonth = parseInt(parts[1], 10) || 1;
    const bDay = parseInt(parts[2], 10) || 1;
    const currentYear = 2026;

    const dosha = getDoshaData(analysis.mulank);
    
    const forecastYears = [2026, 2027, 2028, 2029, 2030].map(y => 
      getPersonalYearData(y, bDay, bMonth)
    );
    const activeYearData = getPersonalYearData(currentYear, bDay, bMonth);

    const fontImportUrl = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap";

    return `
      <link rel="stylesheet" href="${fontImportUrl}" />
      <style>
        #report-print-root *, #report-pdf-temp-root * {
          box-sizing: border-box;
        }
        
        .print-page-wrapper {
          font-family: 'Inter', sans-serif;
          color: #1F2937;
          background-color: #F8F4EF;
          line-height: 1.5;
        }
        
        .pdf-page {
          width: 210mm;
          height: 297mm;
          padding: 16mm 16mm;
          position: relative;
          overflow: hidden;
          background-color: #F8F4EF;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          page-break-after: always;
          break-after: page;
        }
        
        .pdf-flow-page {
          width: 210mm;
          min-height: 297mm;
          padding: 16mm 16mm;
          position: relative;
          background-color: #F8F4EF;
          box-sizing: border-box;
          page-break-before: always;
          break-before: page;
        }
        
        .pdf-row {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }
        
        .pdf-col-1 { flex: 1; }
        .pdf-col-2 { flex: 2; }
        .pdf-col-1-2 { width: 50%; }
        
        .pdf-card {
          background-color: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 12px 16px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.01);
        }
        
        .pdf-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          color: #D97706;
          letter-spacing: 1px;
          margin-top: 0;
          margin-bottom: 8px;
          border-bottom: 1px solid #F3F4F6;
          padding-bottom: 4px;
        }
        
        .pdf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #D97706;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }
        
        .pdf-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          color: #D97706;
          letter-spacing: 2px;
        }
        
        .pdf-header-tag {
          font-family: monospace;
          font-size: 8px;
          font-weight: bold;
          color: #9CA3AF;
        }
        
        .pdf-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #E5E7EB;
          padding-top: 6px;
          margin-top: auto;
          font-size: 8px;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .astro-badge {
          display: inline-block;
          background-color: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
          border-radius: 4px;
          padding: 1px 4px;
          font-size: 8.5px;
          font-weight: bold;
          margin-right: 4px;
        }
      </style>
      
      <div class="print-page-wrapper">
        
        <!-- PAGE 1: LUXURY COVER SHEET -->
        <div class="pdf-page" style="border: 8px double #D97706; padding: 25mm 20mm;">
          <div style="text-align: center; margin-top: 5mm;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: #6B7280;">
              Leo Astrological & Numerological Portal
            </span>
            <div style="width: 60px; height: 1.5px; background-color: #D97706; margin: 15px auto;"></div>
          </div>
          
          <div style="text-align: center; margin-top: 15mm; margin-bottom: 15mm;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; text-transform: uppercase; color: #111827; letter-spacing: 2px; line-height: 1.2; margin: 0;">
              The Grand Cosmic<br />Astrological Blueprint
            </h1>
            <p style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 15px; color: #D97706; margin: 15px 0 0 0;">
              A High-Fidelity Synthesized Vedic Astro-Numerology & Vibrations Mapping
            </p>
            <div style="width: 140px; height: 1px; background-color: #E5E7EB; margin: 25px auto;"></div>
          </div>
          
          <!-- LEO FAMILY Luxury Branding Emblem -->
          <div style="margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-bottom: 15mm;">
            <div style="font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 900; color: #D97706; border: 2px solid #D97706; padding: 6px 18px; border-radius: 4px; letter-spacing: 3px; display: inline-block; background-color: #FAF5EF; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              LEO FAMILY
            </div>
            <span style="font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #6B7280; font-weight: 700; text-align: center;">ASTROLOGICAL TRUST & AUTHORITY</span>
          </div>
          
          <div style="margin: 0 auto; display: block; text-align: center; width: 100%;">
            <svg width="100" height="100" viewBox="0 0 120 120" style="margin: 0 auto; display: block;">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#D97706" stroke-width="2" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#D97706" stroke-width="1" stroke-dasharray="4,2" />
              <circle cx="60" cy="60" r="44" fill="none" stroke="#D97706" stroke-width="1" />
              <path id="curve" fill="none" d="M 22 60 A 38 38 0 0 1 98 60" />
              <text font-family="'Inter', sans-serif" font-size="6.5" font-weight="bold" fill="#D97706" letter-spacing="0.8">
                <textPath href="#curve" startOffset="50%" text-anchor="middle">SACRED COSMIC MATRIX</textPath>
              </text>
              <path id="curve2" fill="none" d="M 98 60 A 38 38 0 0 1 22 60" />
              <text font-family="'Inter', sans-serif" font-size="6.5" font-weight="bold" fill="#D97706" letter-spacing="0.8">
                <textPath href="#curve2" startOffset="50%" text-anchor="middle">★ LEO FAMILY AUTHORITY ★</textPath>
              </text>
              <g transform="translate(60,60) scale(0.75)">
                <polygon points="0,-18 5,-5 18,-5 8,3 12,16 0,8 -12,16 -8,3 -18,-5 -5,-5" fill="#D97706" />
              </g>
            </svg>
          </div>
          
          <div style="margin-top: 15mm; text-align: center; font-size: 12px; color: #374151;">
            <table style="width: 280px; margin: 0 auto; text-align: left; border-collapse: collapse; font-size: 11px;">
              <tr>
                <td style="padding: 6px 0; color: #6B7280; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Prepared For:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${details.name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6B7280; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Date of Birth:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${details.dob}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6B7280; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Mobile Frequency:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${details.mobile}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6B7280; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Prepared On:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${currentDateStr}</td>
              </tr>
            </table>
          </div>
          
          <div class="pdf-footer" style="border: none; text-align: center; justify-content: center; margin-bottom: 5mm; font-weight: bold; color: #D97706;">
            Rajeev Singh Chauhann Method • Secure Certificate ${reportId}
          </div>
        </div>
        
        <!-- PAGE 2: TABLE OF CONTENTS & EXECUTIVE PREFACE -->
        <div class="pdf-page">
          <div class="pdf-header">
            <span class="pdf-header-title">Leo Family Authority • Report Index</span>
            <span class="pdf-header-tag">${reportId} • Page 2</span>
          </div>
          
          <div style="margin-top: 5mm; margin-bottom: 5mm;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 18px; color: #B45309; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #D97706; padding-bottom: 4px;">Table of Contents</h2>
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 11px; margin-top: 15px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">I. Executive Cover & Certificate of Authenticity</span>
                <span style="font-weight: bold; color: #D97706;">Page 1</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">II. Table of Contents & Executive Blessing Preface</span>
                <span style="font-weight: bold; color: #D97706;">Page 2</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">III. Vedic Astro-Numerology Coordinates & Driver Compasses</span>
                <span style="font-weight: bold; color: #D97706;">Page 3</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">IV. The Sacred 3x3 Magic Lo Shu Grid & Alignment Planes</span>
                <span style="font-weight: bold; color: #D97706;">Page 4</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">V. Medical Numerology & Ayurvedic Wellness Diagnostics</span>
                <span style="font-weight: bold; color: #D97706;">Page 5</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">VI. Shifting Personal Years Forecast Table (2026 - 2030)</span>
                <span style="font-weight: bold; color: #D97706;">Page 6</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">VII. Complete Astrological Remedies Shield & Altar Guides</span>
                <span style="font-weight: bold; color: #D97706;">Page 7</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">VIII. Synthesized Conductor & AI Detailed Celestial Readings</span>
                <span style="font-weight: bold; color: #D97706;">Page 8</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #D1D5DB; padding-bottom: 4px;">
                <span style="font-weight: 600; color: #1F2937;">IX. Leo AI Advisor Monthly Guidance Action Plan</span>
                <span style="font-weight: bold; color: #D97706;">Page 9</span>
              </div>
            </div>
          </div>
          
          <div class="pdf-card" style="margin-top: auto; padding: 16px; background-color: #FAF5EE; border: 1px dashed #D97706;">
            <h4 style="font-family: 'Playfair Display', serif; font-size: 11px; text-transform: uppercase; color: #B45309; margin-top: 0; margin-bottom: 6px;">Executive Blessing Preface</h4>
            <p style="font-size: 10px; font-style: italic; color: #4B5563; margin: 0; line-height: 1.5;">
              "Beloved Seeker, numbers are not cold arithmetic; they are the rhythmic heartbeats of cosmic spheres echoing through your earthly lifetime. This custom-crafted report, certified under the Rajeev Astrological standards and optimized through the Leo Family digital workspace, unlocks your psychic Driver (Mulank) and Conductor (Bhagyank) coordinate frequencies. Wear your auspicious tones, honor your gemstones, align your signature, and let the cosmic waves elevate you to the zenith of prosperity."
            </p>
            <span style="display: block; margin-top: 10px; font-size: 9px; text-align: right; font-weight: bold; color: #D97706;">— Rajeev Singh Chauhann, Chief Grand Astrological Council</span>
          </div>
          
          <div class="pdf-footer">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>
        
        <!-- PAGE 3: PERSONAL BLUEPRINT & THE MAGIC LO SHU GRID -->
        <div class="pdf-page">
          <div class="pdf-header">
            <span class="pdf-header-title">III. Personal Profile & Lo Shu Magic Grid</span>
            <span class="pdf-header-tag">${reportId} • Page 3</span>
          </div>
          
          <div class="pdf-row">
            <div class="pdf-col-1-2">
              <div class="pdf-card" style="height: 100%;">
                <h4 class="pdf-card-title">Vedic Planetary Coordinates</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 10px; line-height: 2;">
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Subject Name:</td>
                    <td style="font-weight: bold; text-align: right; color: #111827;">${details.name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Birth Date:</td>
                    <td style="font-weight: bold; text-align: right; color: #111827;">${details.dob}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Driver Number (Mulank):</td>
                    <td style="font-weight: bold; text-align: right; color: #D97706;">
                      <span class="astro-badge">M-${dob.birthNumber}</span>
                      # ${dob.birthNumber}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Conductor Number (Bhagyank):</td>
                    <td style="font-weight: bold; text-align: right; color: #1E40AF;">
                      <span class="astro-badge" style="background-color: #DBEAFE; color: #1E40AF; border-color: #BFDBFE;">B-${dob.lifePathNumber}</span>
                      # ${dob.lifePathNumber}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Birth Compound Number:</td>
                    <td style="font-weight: bold; text-align: right; color: #111827;">
                      # ${dob.birthNumberCompound}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Mobile Compound Number:</td>
                    <td style="font-weight: bold; text-align: right; color: #047857;">
                      # ${mobile.compoundTotal}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Mobile Root Number:</td>
                    <td style="font-weight: bold; text-align: right; color: #047857;">
                      # ${mobile.reducedTotal}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Chaldean Name Value:</td>
                    <td style="font-weight: bold; text-align: right; color: #111827;">${name.chaldeanNumber} (Reduced: ${name.expressionNumber})</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Pythagorean Expression:</td>
                    <td style="font-weight: bold; text-align: right; color: #111827;">${name.pythagoreanNumber}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280;">Mobile Rating Status:</td>
                    <td style="font-weight: bold; text-align: right; color: ${mobile.rating === 'EXCELLENT' || mobile.rating === 'GOOD' ? '#047857' : '#B91C1C'}; text-transform: uppercase;">
                      ${mobile.rating} (${mobile.score}/100)
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="pdf-col-1-2">
              <div class="pdf-card" style="height: 100%; text-align: center;">
                <h4 class="pdf-card-title">Sacred 3x3 Lo Shu Grid</h4>
                <div style="padding: 5px 0 10px 0;">
                  ${renderLoshuGridHTML(analysis)}
                </div>
                <div style="font-size: 8px; color: #6B7280; font-style: italic; line-height: 1.3; text-align: left; padding-top: 6px; border-top: 1px solid #F3F4F6;">
                  *The Magic Lo Shu grid maps planetary elements: Water (#1), Earth (#2, #5, #8), Wood (#3, #4), Metal (#6, #7), Fire (#9). Multiple counts highlight intense concentration, while zeros denote missing elemental fields requiring active Lal Kitab remediation.
                </div>
              </div>
            </div>
          </div>
          
          <div class="pdf-card" style="margin-bottom: 0;">
            <h4 class="pdf-card-title">Grid Configuration Assessment</h4>
            <div style="display: flex; gap: 14px;">
              <div style="flex: 1; font-size: 10px; line-height: 1.4;">
                <strong style="color: #047857; text-transform: uppercase; display: block; margin-bottom: 3px;">Present Vibrational Elements:</strong>
                <ul style="margin: 0; padding-left: 14px; color: #4B5563;">
                  ${Object.values(analysis.loshuGrid)
                    .filter(box => box.count > 0)
                    .slice(0, 4)
                    .map(box => `<li style="margin-bottom: 3px;"><strong>Digit ${box.digit} (${box.element}):</strong> ${box.lifeArea}</li>`)
                    .join('')}
                </ul>
              </div>
              <div style="flex: 1; font-size: 10px; line-height: 1.4; border-left: 1px solid #E5E7EB; padding-left: 14px;">
                <strong style="color: #B91C1C; text-transform: uppercase; display: block; margin-bottom: 3px;">Missing Cosmic Paths:</strong>
                <ul style="margin: 0; padding-left: 14px; color: #4B5563;">
                  ${analysis.missingNumbers.length > 0 
                    ? analysis.missingNumbers.slice(0, 4).map(num => `<li style="margin-bottom: 3px;"><strong>Digit ${num.digit} (${num.element}):</strong> Requires remedial action.</li>`).join('')
                    : '<li style="color: #047857;">Perfect Grid! Zero missing numbers detected.</li>'}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="pdf-footer">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>
        
        <!-- PAGE 4: PLANES OF ALIGNMENT & PLANETARY STRENGTHS CHART -->
        <div class="pdf-page">
          <div class="pdf-header">
            <span class="pdf-header-title">IV. Cosmic Planes & Planetary Strength Charts</span>
            <span class="pdf-header-tag">${reportId} • Page 4</span>
          </div>
          
          <div class="pdf-row">
            <div class="pdf-col-1-2" style="display: flex; flex-direction: column;">
              <div class="pdf-card" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 0;">
                <h4 class="pdf-card-title">Strength Planes & Arrows</h4>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
                  ${renderPlanesHTML(analysis)}
                </div>
              </div>
            </div>
            
            <div class="pdf-col-1-2" style="display: flex; flex-direction: column;">
              <div class="pdf-card" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 0;">
                <h4 class="pdf-card-title">Vedic Planetary Strength Metric</h4>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-around; padding: 4px 0;">
                  ${renderPlanetaryStrengthsHTML(analysis)}
                </div>
              </div>
            </div>
          </div>
          
          <div class="pdf-footer">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>

        <!-- PAGE 5: MEDICAL NUMEROLOGY & AYURVEDIC DOSHA DIAGNOSIS -->
        <div class="pdf-page">
          <div class="pdf-header">
            <span class="pdf-header-title">V. Medical Numerology & Ayurvedic Wellness Diagnostics</span>
            <span class="pdf-header-tag">${reportId} • Page 5</span>
          </div>
          
          <div style="background-color: #FEF2F2; border: 1.5px solid #FCA5A5; border-radius: 12px; padding: 8px 12px; margin-bottom: 10px; font-size: 8px; color: #991B1B; font-weight: 500; line-height: 1.4;">
            <strong>IMPORTANT CLINICAL DISCLAIMER:</strong> This report provides astrological-vibrational wellness insights and Ayurvedic-inspired lifestyle counseling based on ancient Vedic calculations and driver numbers. It DOES NOT constitute, nor is it a substitute for, professional medical advice, diagnosis, or clinical treatment plans. Always consult with a registered physician or healthcare professional for any medical concerns.
          </div>
          
          <div class="pdf-row">
            <div class="pdf-col-1-2">
              <div class="pdf-card" style="height: 100%;">
                <h4 class="pdf-card-title">Ayurvedic Dosha Profile</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 10px; line-height: 1.8;">
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Subject Psychic (Mulank):</td>
                    <td style="font-weight: bold; text-align: right; color: #111827;"># ${analysis.mulank}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Dominant Body Dosha:</td>
                    <td style="font-weight: bold; text-align: right; color: #B45309;">${dosha.name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Vibrational Strength Index:</td>
                    <td style="font-weight: bold; text-align: right; color: #047857;">${dosha.strength}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="color: #6B7280;">Digestive Fire Status:</td>
                    <td style="font-weight: bold; text-align: right; color: #1E40AF;">${dosha.digestive}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280;">Vulnerable Systems:</td>
                    <td style="font-weight: 500; text-align: right; color: #374151; font-size: 8.5px; line-height: 1.3;">${dosha.systems}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="pdf-col-1-2">
              <div class="pdf-card" style="height: 100%;">
                <h4 class="pdf-card-title">Nutritional Guidelines</h4>
                <div style="font-size: 9px; line-height: 1.4; display: flex; flex-direction: column; gap: 6px;">
                  <div>
                    <strong style="color: #047857; text-transform: uppercase; font-size: 8px;">Recommended Foods:</strong>
                    <div style="color: #4B5563; font-weight: 500;">${dosha.foods}</div>
                  </div>
                  <div>
                    <strong style="color: #B91C1C; text-transform: uppercase; font-size: 8px;">Avoid/Reduce Foods:</strong>
                    <div style="color: #4B5563; font-weight: 500;">${dosha.avoid}</div>
                  </div>
                  <div>
                    <strong style="color: #D97706; text-transform: uppercase; font-size: 8px;">Recommended Fruits:</strong>
                    <div style="color: #4B5563; font-weight: 500;">${dosha.fruits}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pdf-card">
            <h4 class="pdf-card-title">Sovereign Rest & Circadian Sleeping Routines</h4>
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.5; font-weight: 500;">
              ${dosha.sleep}
            </p>
          </div>
          
          <div class="pdf-card" style="margin-bottom: 0;">
            <h4 class="pdf-card-title">Sacred Daily Morning Ritual</h4>
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.5; font-weight: 500;">
              ${dosha.routine}
            </p>
          </div>
          
          <div class="pdf-footer">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>

        <!-- PAGE 6: SHIFTING PERSONAL YEARS FORECAST TABLE (2026 - 2030) -->
        <div class="pdf-page">
          <div class="pdf-header">
            <span class="pdf-header-title">VI. Shifting Personal Years Forecast Table</span>
            <span class="pdf-header-tag">${reportId} • Page 6</span>
          </div>
          
          <div class="pdf-card" style="padding: 14px;">
            <h4 class="pdf-card-title">Planetary Transit Blueprint (2026 - 2030)</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid #D97706; background-color: #FAF5EE;">
                  <th style="padding: 6px; font-weight: bold; color: #B45309;">Year</th>
                  <th style="padding: 6px; font-weight: bold; color: #B45309; text-align: center;">Personal Year</th>
                  <th style="padding: 6px; font-weight: bold; color: #B45309;">Planetary Lord</th>
                  <th style="padding: 6px; font-weight: bold; color: #B45309;">Core Transit Theme</th>
                  <th style="padding: 6px; font-weight: bold; color: #B45309; text-align: center;">Vibe Index</th>
                </tr>
              </thead>
              <tbody>
                ${forecastYears.map(fy => `
                  <tr style="border-bottom: 1px solid #E5E7EB;">
                    <td style="padding: 6px; font-weight: bold; color: #111827;">${fy.year}</td>
                    <td style="padding: 6px; text-align: center;">
                      <span class="astro-badge" style="background-color: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; padding: 2px 6px;">PY - ${fy.number}</span>
                    </td>
                    <td style="padding: 6px; font-weight: 600; color: #1F2937;">${fy.lord}</td>
                    <td style="padding: 6px; color: #4B5563; font-size: 9px; line-height: 1.3;">${fy.desc}</td>
                    <td style="padding: 6px; text-align: center; font-weight: 700; color: #047857;">${fy.vibe}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="pdf-card" style="margin-bottom: 0;">
            <h4 class="pdf-card-title">Deep Wisdom Analysis for Active Personal Year (${currentYear})</h4>
            <p style="font-size: 10.5px; color: #1F2937; margin-bottom: 8px; line-height: 1.5; font-weight: 600;">
              ${activeYearData.theme} — Governed by ${activeYearData.lord}
            </p>
            <p style="font-size: 10px; color: #4B5563; margin-bottom: 10px; line-height: 1.5;">
              ${analysis.personalYear.forecast}
            </p>
            
            <div style="display: flex; gap: 10px; font-size: 9px; margin-top: 10px; border-top: 1px solid #F3F4F6; padding-top: 8px;">
              <div style="flex: 1;">
                <strong style="color: #047857; text-transform: uppercase; font-size: 8px; display: block; margin-bottom: 2px;">Key Opportunities:</strong>
                <span style="color: #4B5563; line-height: 1.3; display: block;">Excellent time to align professional decisions with ${activeYearData.lord} frequencies. Seek out high-value joint ventures and strategic investments.</span>
              </div>
              <div style="flex: 1; border-left: 1px solid #E5E7EB; padding-left: 10px;">
                <strong style="color: #B91C1C; text-transform: uppercase; font-size: 8px; display: block; margin-bottom: 2px;">Important Hurdles:</strong>
                <span style="color: #4B5563; line-height: 1.3; display: block;">Do not make abrupt decisions without calculating name spell balances. Guard energy reserves on high-pressure days.</span>
              </div>
            </div>
          </div>
          
          <div class="pdf-footer">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>
        
        <!-- PAGE 7: ASTROLOGICAL REMEDIES & LAL KITAB ADVICE -->
        <div class="pdf-page">
          <div class="pdf-header">
            <span class="pdf-header-title">VII. Astrological Remedies & Lal Kitab Advice</span>
            <span class="pdf-header-tag">${reportId} • Page 7</span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 10px;">
            <div class="pdf-card" style="margin: 0; padding: 10px 14px;">
              <h4 class="pdf-card-title">Favorable Gemstones</h4>
              <p style="font-size: 10px; color: #4B5563; margin: 0; font-weight: 600; line-height: 1.4;">
                ${rem.gemstones.join(' or ') || 'Seek consulting advice for planetary gemstone assignment.'}
              </p>
              <span style="font-size: 8px; color: #9CA3AF; display: block; margin-top: 4px;">Wear on specified finger matching transit periods.</span>
            </div>
            
            <div class="pdf-card" style="margin: 0; padding: 10px 14px;">
              <h4 class="pdf-card-title">Auspicious Colors</h4>
              <p style="font-size: 10px; color: #4B5563; margin: 0; font-weight: 600; line-height: 1.4;">
                ${rem.colors.join(', ') || 'Wear white, light blue, or cream tones.'}
              </p>
              <span style="font-size: 8px; color: #9CA3AF; display: block; margin-top: 4px;">Utilize in daily attire to invite positive energies.</span>
            </div>
          </div>
          
          <div class="pdf-card" style="padding: 10px 14px;">
            <h4 class="pdf-card-title">Chaldean Spelling Modification Advice</h4>
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.4; font-weight: 500;">
              ${rem.nameCorrection || 'Your spelling compound sum aligns clean. No modifications needed.'}
            </p>
          </div>
          
          <div class="pdf-card" style="padding: 10px 14px;">
            <h4 class="pdf-card-title">Lucky Days & Calendar Dates</h4>
            <div style="display: flex; gap: 14px; font-size: 10px;">
              <div style="flex: 1;">
                <strong style="color: #D97706; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">Fortunate Days:</strong>
                <span style="font-weight: 600; color: #4B5563;">${rem.luckyDays.join(', ') || 'Sundays & Wednesdays'}</span>
              </div>
              <div style="flex: 1; border-left: 1px solid #E5E7EB; padding-left: 14px;">
                <strong style="color: #D97706; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">Lucky Calendar Dates:</strong>
                <span style="font-weight: 600; color: #4B5563;">${rem.luckyDates.map(d => `#${d}`).join(', ') || '#1, #5, #6, #9'}</span>
              </div>
            </div>
          </div>
          
          <div class="pdf-card" style="padding: 10px 14px;">
            <h4 class="pdf-card-title">Professional Signature Alignments</h4>
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.4; font-weight: 500;">
              ${rem.signatureAdvice || 'Always sign upward at a 15-degree angle. Never cross out your signature or end with dots.'}
            </p>
          </div>
          
          <div class="pdf-card" style="padding: 10px 14px;">
            <h4 class="pdf-card-title">Mobile Suffix Codes & Recommendations</h4>
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.4; font-weight: 500;">
              Recommend choosing a mobile number ending in: <strong>${rem.mobileEndings.join(', ') || '5, 6, or 1'}</strong>. Avoid pairs matching negative planetary vibrations like Saturn-Rahu (84/48) or Sun-Saturn (18/81) in the last digits.
            </p>
          </div>

          <div class="pdf-card" style="margin-bottom: 0; padding: 10px 14px; background-color: #FAF5EE; border: 1px dashed #D97706;">
            <h4 class="pdf-card-title">Custom Altar Orientation Guidelines</h4>
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.4; font-weight: 500;">
              For maximum energy conduction, set up your home altar in the <strong>North-East (ईशान कोण)</strong> sector of your residence. Keep it perfectly clean, light sandalwood incense during sunrise transits, and place a small copper water vessel on the altar daily.
            </p>
          </div>
          
          <div class="pdf-footer">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>
        
        <!-- PAGE 8+: DETAILED COSMIC READING -->
        <div class="pdf-flow-page">
          <div class="pdf-header">
            <span class="pdf-header-title">VIII. Synthesized Conductor & Predictive Insights</span>
            <span class="pdf-header-tag">${reportId} • AI Analysis</span>
          </div>
          
          <div style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.6; color: #374151;">
            ${formatMarkdownForPrint(reportText || '')}
          </div>
          
          <div style="margin-top: 30px; border-top: 1px dashed #D97706; padding-top: 15px; text-align: center; font-size: 10px; color: #D97706; font-family: 'Playfair Display', serif; font-style: italic; page-break-inside: avoid; break-inside: avoid;">
            "Numbers do not bind your soul, they merely map planetary transits. By choosing friendly cosmic vectors, spelling balances, and mindful signature alignments, you dissolve inherited delays and unlock absolute prosperity."
          </div>
          
          <div class="pdf-footer" style="margin-top: 25px;">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>

        <!-- PAGE 9: LEO AI ADVISOR STRATEGIC MONTHLY FOCUS -->
        <div class="pdf-page" style="page-break-before: always; break-before: page;">
          <div class="pdf-header">
            <span class="pdf-header-title">IX. Leo AI Advisor Monthly Guidance Matrix</span>
            <span class="pdf-header-tag">${reportId} • Action Plan</span>
          </div>
          
          <div style="font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
            <p style="font-size: 11px; font-weight: 500; color: #4B5563; margin-bottom: 15px; line-height: 1.5; font-style: italic;">
              Based on your complete numerology profile, here are the 3 most important things to focus on this month.
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <!-- Career Card -->
              <div style="background-color: #FFFDF9; border: 1.5px solid #FEF3C7; border-radius: 16px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="font-size: 16px;">💼</span>
                  <span style="font-family: 'Playfair Display', serif; font-size: 13px; font-weight: bold; color: #B45309; text-transform: uppercase; letter-spacing: 0.5px;">I. Career Focus: ${advisorActions ? advisorActions.career.title : 'Strategic Professional Acceleration'}</span>
                </div>
                <p style="font-size: 11px; color: #4B5563; margin: 0 0 8px 0; line-height: 1.5;">${advisorActions ? advisorActions.career.description : 'Align career transitions with your conduct root numbers to unlock authority.'}</p>
                <div style="font-size: 10px; font-weight: 600; color: #B45309; background-color: #FEF3C7; padding: 5px 10px; border-radius: 8px; display: inline-block;">
                  <strong style="font-family: monospace;">SACRED TRANSIT REMEDY:</strong> ${advisorActions ? advisorActions.career.remedy : 'Light small oil lamps on Wednesdays.'}
                </div>
              </div>

              <!-- Relationship Card -->
              <div style="background-color: #FFFDF9; border: 1.5px solid #FCE7F3; border-radius: 16px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="font-size: 16px;">💖</span>
                  <span style="font-family: 'Playfair Display', serif; font-size: 13px; font-weight: bold; color: #BE185D; text-transform: uppercase; letter-spacing: 0.5px;">II. Relationship Focus: ${advisorActions ? advisorActions.relationship.title : 'Vibrational Marital Sync'}</span>
                </div>
                <p style="font-size: 11px; color: #4B5563; margin: 0 0 8px 0; line-height: 1.5;">${advisorActions ? advisorActions.relationship.description : 'Maintain high emotional transparency with your partner to avoid communication lapses.'}</p>
                <div style="font-size: 10px; font-weight: 600; color: #BE185D; background-color: #FCE7F3; padding: 5px 10px; border-radius: 8px; display: inline-block;">
                  <strong style="font-family: monospace;">SACRED TRANSIT REMEDY:</strong> ${advisorActions ? advisorActions.relationship.remedy : 'Wear pastel pink tones on Fridays.'}
                </div>
              </div>

              <!-- Health Card -->
              <div style="background-color: #FFFDF9; border: 1.5px solid #D1FAE5; border-radius: 16px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="font-size: 16px;">🌿</span>
                  <span style="font-family: 'Playfair Display', serif; font-size: 13px; font-weight: bold; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">III. Health & Wellness Focus: ${advisorActions ? advisorActions.health.title : 'Ayurvedic Circadian Harmony'}</span>
                </div>
                <p style="font-size: 11px; color: #4B5563; margin: 0 0 8px 0; line-height: 1.5;">${advisorActions ? advisorActions.health.description : 'Avoid heavy carbonated foods during high-acidity Pitta transits.'}</p>
                <div style="font-size: 10px; font-weight: 600; color: #047857; background-color: #D1FAE5; padding: 5px 10px; border-radius: 8px; display: inline-block;">
                  <strong style="font-family: monospace;">SACRED TRANSIT REMEDY:</strong> ${advisorActions ? advisorActions.health.remedy : 'Practice gentle grounding breathing rituals.'}
                </div>
              </div>
            </div>
          </div>
          
          <div class="pdf-footer" style="margin-top: auto;">
            <span>Prepared Specially For: ${details.name}</span>
            <span>Rajeev Astrological Methods</span>
          </div>
        </div>
        
      </div>
    `;
  };

  const handlePrint = () => {
    if (!reportText) return;
    
    const analysis = computeLoshuAnalysis(
      personalDetails.dob,
      personalDetails.name,
      personalDetails.gender || 'MALE'
    );

    const computedAdvisorActions = generateLeoAdvisorActions(dobData, nameData, mobileData);

    const currentDateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportId = `LEO-COSMIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let printRoot = document.getElementById('report-print-root');
    if (!printRoot) {
      printRoot = document.createElement('div');
      printRoot.id = 'report-print-root';
      printRoot.className = 'hidden print:block';
      document.body.appendChild(printRoot);
    }
    
    printRoot.innerHTML = generateFullBrandedReportHTML(
      personalDetails,
      dobData,
      nameData,
      mobileData,
      remedies,
      reportId,
      currentDateStr,
      analysis,
      computedAdvisorActions
    );

    document.body.classList.add('print-custom-report');
    window.focus();
    window.print();
    const cleanup = () => {
      document.body.classList.remove('print-custom-report');
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    setTimeout(cleanup, 800);
  };

  const handleDownloadPDF = async () => {
    if (!reportText) return;
    setPdfLoading(true);
    try {
      const analysis = computeLoshuAnalysis(
        personalDetails.dob,
        personalDetails.name,
        personalDetails.gender || 'MALE'
      );

      const computedAdvisorActions = generateLeoAdvisorActions(dobData, nameData, mobileData);

      const currentDateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const reportId = `LEO-COSMIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const tempContainer = document.createElement('div');
      tempContainer.id = 'report-pdf-temp-root';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.zIndex = '-1000';
      
      const htmlContent = generateFullBrandedReportHTML(
        personalDetails,
        dobData,
        nameData,
        mobileData,
        remedies,
        reportId,
        currentDateStr,
        analysis,
        computedAdvisorActions
      );
      
      tempContainer.innerHTML = htmlContent;
      document.body.appendChild(tempContainer);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pages = tempContainer.querySelectorAll('.pdf-page, .pdf-flow-page');
      
      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#F8F4EF'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (pageElement.classList.contains('pdf-page')) {
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight);
        } else {
          let heightLeft = imgHeight;
          let position = 0;
          
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
      }

      pdf.save(`${personalDetails.name.replace(/\s+/g, '_')}_Leo_Cosmic_Report.pdf`);
      document.body.removeChild(tempContainer);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
      alert('Failed to generate high-fidelity PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div id="report-generator-panel" className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {!reportText ? (
        <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm text-center space-y-6 max-w-2xl mx-auto py-12">
          <div className="w-16 h-16 rounded-full bg-[#D97706]/10 border border-[#D97706]/20 text-[#D97706] flex items-center justify-center text-3xl mx-auto shadow-md">
            📜
          </div>
          <div className="space-y-2">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Vedic Astrology & AI Conductor Report</h3>
            <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed font-sans">
              Consolidate your numerological readings into a single comprehensive Indian Numerology report. This synthesis aligns certified planetary calculations with advanced artificial intelligence (Gemini AI) for precise Driver and Conductor insights.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs text-left max-w-lg mx-auto font-sans">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`w-full md:w-auto bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 text-xs tracking-widest uppercase cursor-pointer ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              {loading ? 'Analyzing Celestial Paths...' : 'Generate AI Astrological Report'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Your Personalized Indian Numerology Report</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setReportText(null)}
                className="bg-[#F2E8DC] hover:bg-[#E5D7C6] text-[#D97706] font-semibold px-5 py-2.5 rounded-xl text-xs transition duration-300 cursor-pointer border border-[#D97706]/20 font-sans"
              >
                Reset / Restart
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#F2E8DC] hover:bg-[#E5D7C6] text-[#D97706] font-semibold px-5 py-2.5 rounded-xl text-xs transition duration-300 cursor-pointer border border-[#D97706]/20 font-sans"
              >
                Print Report
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition duration-300 cursor-pointer shadow-sm font-sans flex items-center gap-2"
              >
                {pdfLoading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  'Download Premium PDF'
                )}
              </button>
            </div>
          </div>

          <div id="ai-report-body" className="glass-panel p-8 md:p-12 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm text-slate-700 text-sm leading-relaxed prose max-w-none text-left space-y-6">
            <ReactMarkdown>{reportText}</ReactMarkdown>
          </div>

          {/* Leo AI Advisor Section */}
          {advisorActions && (
            <div className="glass-panel p-6 md:p-8 rounded-[35px] bg-gradient-to-br from-amber-50/40 via-white to-amber-50/10 border border-[#E5E7EB] shadow-sm text-left space-y-6 mt-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-3 border-b border-amber-200/50 pb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#D97706] flex items-center justify-center text-xl shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Leo AI Advisor Guidance</h3>
                  <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold block">Actionable Strategic Focus</span>
                </div>
              </div>

              <p className="text-[#4B5563] text-xs leading-relaxed font-sans">
                Based on your complete numerology profile, here are the 3 most important things to focus on this month. This turns your celestial map into concrete, daily, and weekly actions to drive tangible success.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Career Focus */}
                <div className="bg-white border border-[#FEF3C7] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#B45309]">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider">Career Focus</span>
                    </div>
                    <h4 className="font-playfair text-sm font-bold text-[#1F2937]">{advisorActions.career.title}</h4>
                    <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{advisorActions.career.description}</p>
                  </div>
                  <div className="bg-[#FEF3C7]/60 p-3.5 rounded-2xl text-[11px] text-[#B45309] font-medium leading-relaxed font-sans">
                    <strong className="font-mono text-[9px] uppercase font-black tracking-wider block mb-1 text-amber-800">Transit Remedy:</strong>
                    {advisorActions.career.remedy}
                  </div>
                </div>

                {/* Relationship Focus */}
                <div className="bg-white border border-[#FCE7F3] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#BE185D]">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider">Relationship Focus</span>
                    </div>
                    <h4 className="font-playfair text-sm font-bold text-[#1F2937]">{advisorActions.relationship.title}</h4>
                    <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{advisorActions.relationship.description}</p>
                  </div>
                  <div className="bg-[#FCE7F3]/60 p-3.5 rounded-2xl text-[11px] text-[#BE185D] font-medium leading-relaxed font-sans">
                    <strong className="font-mono text-[9px] uppercase font-black tracking-wider block mb-1 text-pink-800">Transit Remedy:</strong>
                    {advisorActions.relationship.remedy}
                  </div>
                </div>

                {/* Health Focus */}
                <div className="bg-white border border-[#D1FAE5] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#047857]">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider">Wellness Focus</span>
                    </div>
                    <h4 className="font-playfair text-sm font-bold text-[#1F2937]">{advisorActions.health.title}</h4>
                    <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{advisorActions.health.description}</p>
                  </div>
                  <div className="bg-[#D1FAE5]/60 p-3.5 rounded-2xl text-[11px] text-[#047857] font-medium leading-relaxed font-sans">
                    <strong className="font-mono text-[9px] uppercase font-black tracking-wider block mb-1 text-emerald-800">Transit Remedy:</strong>
                    {advisorActions.health.remedy}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ReportTab;
