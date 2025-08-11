import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Shield, Copy, RotateCcw, Trash, Layers, Lightbulb, Check, Lock, EyeOff, Shuffle } from "lucide-react";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = "0Ol1I";

export default function PasswordGenerator() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [showBulkResults, setShowBulkResults] = useState(false);
  const [bulkCount, setBulkCount] = useState("10");
  
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const getPasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) {
      return { score: 25, label: "Weak", color: "text-red-600", bgColor: "bg-red-500" };
    } else if (score <= 4) {
      return { score: 50, label: "Fair", color: "text-amber-600", bgColor: "bg-amber-500" };
    } else {
      return { score: 85, label: "Strong", color: "text-emerald-600", bgColor: "bg-emerald-500" };
    }
  }, []);

  const generatePassword = useCallback((opts: PasswordOptions): string => {
    let charset = "";
    
    if (opts.includeUppercase) charset += UPPERCASE;
    if (opts.includeLowercase) charset += LOWERCASE;
    if (opts.includeNumbers) charset += NUMBERS;
    if (opts.includeSymbols) charset += SYMBOLS;
    
    if (opts.excludeSimilar) {
      charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
    }
    
    if (!charset) {
      throw new Error("At least one character type must be selected");
    }
    
    // Use crypto.getRandomValues for secure random generation
    const array = new Uint8Array(opts.length);
    crypto.getRandomValues(array);
    
    let result = "";
    for (let i = 0; i < opts.length; i++) {
      result += charset[array[i] % charset.length];
    }
    
    return result;
  }, []);

  const handleGeneratePassword = useCallback(() => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      setShowBulkResults(false);
      toast({
        title: "Password Generated",
        description: "New secure password has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
    }
  }, [options, generatePassword, toast]);

  const handleCopyPassword = useCallback(async (passwordToCopy: string = password) => {
    if (!passwordToCopy) {
      toast({
        title: "No Password",
        description: "Please generate a password first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(passwordToCopy);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password. Please try again.",
        variant: "destructive",
      });
    }
  }, [password, toast]);

  const handleClearPassword = useCallback(() => {
    setPassword("");
    setBulkPasswords([]);
    setShowBulkResults(false);
    toast({
      title: "Cleared",
      description: "Password fields have been cleared.",
    });
  }, [toast]);

  const handleGenerateBulkPasswords = useCallback(() => {
    try {
      const count = parseInt(bulkCount);
      const passwords = Array.from({ length: count }, () => generatePassword(options));
      setBulkPasswords(passwords);
      setShowBulkResults(true);
      toast({
        title: "Bulk Generation Complete",
        description: `Generated ${count} secure passwords successfully.`,
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
    }
  }, [bulkCount, options, generatePassword, toast]);

  const handleCopyAllPasswords = useCallback(async () => {
    if (bulkPasswords.length === 0) return;
    
    // Use proper line breaks that work across platforms
    const allPasswords = bulkPasswords.join('\r\n');
    try {
      await navigator.clipboard.writeText(allPasswords);
      toast({
        title: "All Passwords Copied",
        description: `${bulkPasswords.length} passwords copied, each on a separate line.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy passwords. Please try again.",
        variant: "destructive",
      });
    }
  }, [bulkPasswords, toast]);

  const handleOptionChange = useCallback((key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  // Generate initial password on component mount
  useEffect(() => {
    handleGeneratePassword();
  }, []);

  const strength = getPasswordStrength(password);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-primary-600 p-1.5 sm:p-2 rounded-lg">
                <Shield className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">SecurePass</h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Password Generator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Generate Secure Passwords
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Create strong, unique passwords to protect your accounts. Customize length and character types for maximum security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Password Generator */}
          <div className="lg:col-span-2 order-1">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl text-slate-900">Password Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Generated Password Display */}
                <div>
                  <Label htmlFor="generated-password" className="block text-sm font-medium text-slate-700 mb-2">
                    Generated Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="generated-password"
                      type="text"
                      value={password}
                      readOnly
                      className="w-full px-3 sm:px-4 py-4 sm:py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm sm:text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12 sm:pr-14 break-all"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyPassword()}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-2 text-slate-400 hover:text-primary-600 touch-manipulation"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Password Strength</span>
                      <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
                    </div>
                    <Progress value={strength.score} className="w-full h-2" />
                  </div>
                </div>

                {/* Password Options */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password-length" className="block text-sm font-medium text-slate-700 mb-2">
                      Password Length: <span className="font-semibold text-primary-600">{options.length}</span>
                    </Label>
                    <input
                      type="range"
                      id="password-length"
                      min="4"
                      max="128"
                      value={options.length}
                      onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                      className="w-full h-3 sm:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>4</span>
                      <span>128</span>
                    </div>
                  </div>

                  {/* Character Type Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-4 sm:space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation">
                        <Checkbox
                          id="include-uppercase"
                          checked={options.includeUppercase}
                          onCheckedChange={(checked) => handleOptionChange('includeUppercase', !!checked)}
                          className="w-5 h-5"
                        />
                        <Label htmlFor="include-uppercase" className="text-sm text-slate-700 flex-1 cursor-pointer">
                          Uppercase Letters (A-Z)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation">
                        <Checkbox
                          id="include-lowercase"
                          checked={options.includeLowercase}
                          onCheckedChange={(checked) => handleOptionChange('includeLowercase', !!checked)}
                          className="w-5 h-5"
                        />
                        <Label htmlFor="include-lowercase" className="text-sm text-slate-700 flex-1 cursor-pointer">
                          Lowercase Letters (a-z)
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-4 sm:space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation">
                        <Checkbox
                          id="include-numbers"
                          checked={options.includeNumbers}
                          onCheckedChange={(checked) => handleOptionChange('includeNumbers', !!checked)}
                          className="w-5 h-5"
                        />
                        <Label htmlFor="include-numbers" className="text-sm text-slate-700 flex-1 cursor-pointer">
                          Numbers (0-9)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation">
                        <Checkbox
                          id="include-symbols"
                          checked={options.includeSymbols}
                          onCheckedChange={(checked) => handleOptionChange('includeSymbols', !!checked)}
                          className="w-5 h-5"
                        />
                        <Label htmlFor="include-symbols" className="text-sm text-slate-700 flex-1 cursor-pointer">
                          Symbols (!@#$%^&*)
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Exclude Similar Characters */}
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation">
                    <Checkbox
                      id="exclude-similar"
                      checked={options.excludeSimilar}
                      onCheckedChange={(checked) => handleOptionChange('excludeSimilar', !!checked)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="exclude-similar" className="text-sm text-slate-700 flex-1 cursor-pointer">
                      Exclude similar characters (0, O, l, I, 1)
                    </Label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={handleGeneratePassword}
                    className="h-12 sm:h-10 bg-primary-600 text-white hover:bg-primary-700 touch-manipulation font-medium"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>
                  <Button
                    onClick={() => handleCopyPassword()}
                    variant="secondary"
                    className="h-12 sm:h-10 bg-slate-600 text-white hover:bg-slate-700 touch-manipulation font-medium"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={handleClearPassword}
                    variant="outline"
                    className="h-12 sm:h-10 border-slate-300 text-slate-600 hover:bg-slate-50 touch-manipulation font-medium"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Features */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Bulk Password Generation */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg text-slate-900">Bulk Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulk-count" className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Passwords
                  </Label>
                  <Select value={bulkCount} onValueChange={setBulkCount}>
                    <SelectTrigger className="h-12 sm:h-10 touch-manipulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 passwords</SelectItem>
                      <SelectItem value="10">10 passwords</SelectItem>
                      <SelectItem value="25">25 passwords</SelectItem>
                      <SelectItem value="50">50 passwords</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleGenerateBulkPasswords}
                  className="w-full h-12 sm:h-10 bg-primary-600 text-white hover:bg-primary-700 touch-manipulation font-medium"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Generate Multiple
                </Button>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 flex items-center">
                  <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Use unique passwords for each account
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Minimum 12 characters for strong security
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Include mix of character types
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Store passwords in a password manager
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    Enable two-factor authentication
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Password Strength Guide */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Strength Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Weak</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-red-200 rounded-full h-2 mr-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{'< 8 chars'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Fair</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-amber-200 rounded-full h-2 mr-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <span className="text-xs text-slate-500">8-11 chars</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Strong</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-emerald-200 rounded-full h-2 mr-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs text-slate-500">12+ chars</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bulk Password Results */}
        {showBulkResults && bulkPasswords.length > 0 && (
          <Card className="mt-6 sm:mt-8 shadow-sm border-slate-200">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg text-slate-900">Generated Passwords ({bulkPasswords.length})</CardTitle>
                <Button
                  onClick={handleCopyAllPasswords}
                  className="bg-primary-600 text-white hover:bg-primary-700 text-sm h-10 touch-manipulation font-medium"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:gap-3">
                {bulkPasswords.map((pwd, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg border">
                    <span className="text-xs text-slate-400 font-mono w-6 flex-shrink-0">#{index + 1}</span>
                    <code className="font-mono text-xs sm:text-sm flex-1 break-all overflow-hidden">{pwd}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyPassword(pwd)}
                      className="p-2 text-slate-400 hover:text-primary-600 touch-manipulation flex-shrink-0"
                      title="Copy this password"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Shield className="text-white w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900">SecurePass</span>
              </div>
              <p className="text-slate-600 text-sm">
                Generate secure, random passwords to protect your digital accounts. 
                All password generation happens locally in your browser.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Security Features</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <Lock className="text-primary-600 mr-2 w-4 h-4" />
                  Client-side generation
                </li>
                <li className="flex items-center">
                  <EyeOff className="text-primary-600 mr-2 w-4 h-4" />
                  No data stored or transmitted
                </li>
                <li className="flex items-center">
                  <Shuffle className="text-primary-600 mr-2 w-4 h-4" />
                  Cryptographically secure random
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Best Practices</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Use unique passwords for each account</li>
                <li>Store passwords in a password manager</li>
                <li>Enable two-factor authentication</li>
                <li>Regular password updates</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
            <p className="text-sm text-slate-500">
              © 2024 SecurePass. Your passwords are generated locally and never leave your device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
