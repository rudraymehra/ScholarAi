"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, MessageSquare, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface PDFUploadProps {
  onClose?: () => void;
}

export default function PDFUpload({ onClose }: PDFUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyFindings, setKeyFindings] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // For demo: simulate upload with mock response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      setDocumentId("mock-doc-" + Date.now());
      setSummary(
        "This paper presents a comprehensive analysis of the research methodology, including experimental design, data collection procedures, and statistical analysis. The authors demonstrate significant findings that contribute to the field's understanding of the subject matter."
      );
      setKeyFindings([
        "The study found a 42% improvement in the primary outcome measure",
        "Statistical significance was achieved (p < 0.001)",
        "Results were consistent across multiple subgroup analyses",
        "Limitations include sample size and geographic constraints",
      ]);

      toast.success("PDF analyzed successfully!");
    } catch (error) {
      toast.error("Failed to analyze PDF");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || !documentId) return;

    setIsAsking(true);
    try {
      // Mock Q&A
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAnswer(
        `Based on the document, ${question.toLowerCase().includes("method") ? "the methodology involves a randomized controlled trial with double-blind procedures" : question.toLowerCase().includes("result") ? "the main results show significant improvements in all measured outcomes" : "the paper addresses this topic through comprehensive analysis of the available data and literature review"}.`
      );
    } catch (error) {
      toast.error("Failed to get answer");
      console.error(error);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="card-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 result-header">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-lg">PDF Document Q&A</h2>
              <p className="text-sm text-white/70">Upload a paper and ask questions</p>
            </div>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <div className="p-6">
          {!documentId ? (
            <>
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                  isDragOver
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : file
                    ? "border-[var(--success)] bg-[var(--success)]/5"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="p-3 bg-[var(--success)]/10 rounded-xl">
                      <FileText className="w-8 h-8 text-[var(--success)]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[var(--foreground)]">{file.name}</p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setFile(null)}
                      className="p-2 text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-[var(--background-secondary)] rounded-2xl inline-block mb-4">
                      <Upload className="w-10 h-10 text-[var(--foreground-muted)]" />
                    </div>
                    <p className="text-[var(--foreground)] mb-2">
                      Drag and drop a PDF file, or{" "}
                      <label className="text-[var(--primary)] hover:text-[var(--primary-light)] cursor-pointer font-semibold">
                        browse
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Upload a research paper to ask questions about it
                    </p>
                  </>
                )}
              </div>

              {file && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-5 w-full py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing PDF...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Analyze Document
                    </>
                  )}
                </motion.button>
              )}
            </>
          ) : (
            <>
              {/* Document Summary */}
              <div className="mb-6">
                <h3 className="font-serif font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                  Document Summary
                </h3>
                <p className="text-[var(--foreground-muted)] leading-relaxed">{summary}</p>
              </div>

              {/* Key Findings */}
              <div className="mb-6">
                <h3 className="font-serif font-semibold text-[var(--foreground)] mb-3">
                  Key Findings
                </h3>
                <ul className="space-y-3">
                  {keyFindings.map((finding, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 text-[var(--foreground-muted)]"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{finding}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Q&A Section */}
              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="font-serif font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[var(--accent)]" />
                  Ask a Question
                </h3>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    placeholder="What methodology was used?"
                    className="input-elegant flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAsk}
                    disabled={isAsking || !question.trim()}
                    className="px-5 py-2 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    {isAsking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {answer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/20"
                    >
                      <p className="text-[var(--foreground)]">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setFile(null);
                  setDocumentId(null);
                  setSummary(null);
                  setKeyFindings([]);
                  setQuestion("");
                  setAnswer(null);
                }}
                className="mt-6 w-full py-3 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors font-medium"
              >
                Upload Another Document
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
