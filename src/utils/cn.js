// src/utils/cn.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS conflict resolution
 * Combines clsx for conditional classes with tailwind-merge for proper Tailwind class merging
 * @param {...any} inputs - Class names, objects, arrays, or conditionals
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Alternative class name utility without Tailwind merge (lighter weight)
 * Use this if you don't need Tailwind conflict resolution
 */
export function cx(...inputs) {
  return clsx(inputs);
}

/**
 * Conditionally join class names
 * @param {...any} classes - Class names or false/null/undefined
 * @returns {string} Joined class names
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create a conditional class string based on a condition
 * @param {boolean} condition - Condition to check
 * @param {string} trueClass - Class to apply if true
 * @param {string} falseClass - Class to apply if false (optional)
 * @returns {string} Resulting class string
 */
export function conditionalClass(condition, trueClass, falseClass = '') {
  return condition ? trueClass : falseClass;
}

/**
 * Create variant-based class names
 * @param {Object} variants - Variant definitions
 * @param {Object} props - Current variant props
 * @returns {string} Combined class names
 */
export function variantClasses(variants, props) {
  const classes = [];
  
  Object.entries(props).forEach(([key, value]) => {
    if (variants[key] && variants[key][value]) {
      classes.push(variants[key][value]);
    }
  });
  
  return classes.join(' ');
}

/**
 * Example usage for creating variant-based components:
 * 
 * const buttonVariants = {
 *   variant: {
 *     default: 'bg-blue-500 text-white',
 *     outline: 'border border-gray-300',
 *     ghost: 'hover:bg-gray-100'
 *   },
 *   size: {
 *     sm: 'px-2 py-1 text-sm',
 *     md: 'px-4 py-2',
 *     lg: 'px-6 py-3 text-lg'
 *   }
 * };
 * 
 * const className = cn(
 *   'rounded-md transition-colors',
 *   variantClasses(buttonVariants, { variant: 'default', size: 'md' })
 * );
 */

export default cn;